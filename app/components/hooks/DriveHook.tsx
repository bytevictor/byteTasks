"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  ReactNode,
} from "react";
import { dbHelper } from "@/app/utils/IndexedDBHelper";

// Types
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type StorageMode = "drive" | "guest" | "none";

interface DriveContextType {
  user: any; // User object for Drive, or { name: "Guest" } for guest
  isReady: boolean;
  isSyncing: boolean;
  error: string | null;
  tasks: Task[];
  storageMode: StorageMode;
  setTasks: (tasks: Task[]) => void;
  handleLogin: () => void;
  handleGuestLogin: () => void;
  handleLogout: () => void;
  loadTasks: () => Promise<Task[]>;
  saveTasks: (tasks: Task[]) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/drive.file email profile";
const FOLDER_NAME = "byteTasks";
const FILE_NAME = "byteTasks.json";

// Global types
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const DriveProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [gapiInitialized, setGapiInitialized] = useState(false);
  const [gisInitialized, setGisInitialized] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [storageMode, setStorageMode] = useState<StorageMode>("none");

  // Load persistence state on mount
  useEffect(() => {
    // Check for saved mode
    const savedMode = localStorage.getItem("storage_mode") as StorageMode;
    if (savedMode === "guest") {
      setStorageMode("guest");
      setUser({ name: "Guest", picture: null }); // Mock user for guest
    }
    // 'drive' restoration is handled by the GAPI useEffect below
  }, []);

  useEffect(() => {
    if (!CLIENT_ID || !API_KEY) {
      setError(
        "Missing Credentials. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_API_KEY to .env.local"
      );
      return;
    }

    const loadGapi = () => {
      if (typeof window !== "undefined" && window.gapi) {
        setGapiInitialized(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client", async () => {
          try {
            await window.gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: DISCOVERY_DOCS,
            });
            setGapiInitialized(true);
          } catch (err) {
            console.error("Error initializing gapi client", err);
            setError("Failed to initialize Google API client.");
          }
        });
      };
      script.onerror = (e) => {
        console.error("Failed to load gapi script", e);
        setError("Failed to load Google API script.");
      };
      document.body.appendChild(script);
    };

    const loadGis = () => {
      const initGis = () => {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (tokenResponse: any) => {
              if (tokenResponse && tokenResponse.access_token) {
                // Save to localStorage
                const expiresIn = tokenResponse.expires_in || 3599;
                const expiryTime = Date.now() + expiresIn * 1000;
                localStorage.setItem(
                  "gdrive_token",
                  tokenResponse.access_token
                );
                localStorage.setItem(
                  "gdrive_token_expiry",
                  expiryTime.toString()
                );
                localStorage.setItem("storage_mode", "drive");
                setStorageMode("drive");

                // Fetch user info
                try {
                  const userInfoResponse = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                      headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                      },
                    }
                  );
                  const userInfo = await userInfoResponse.json();
                  setUser(userInfo);
                } catch (error) {
                  console.error("Failed to fetch user info", error);
                  // Fallback if fetch fails, though image won't work
                  setUser({ name: "User" });
                }
              }
            },
          });
          setTokenClient(client);
          setGisInitialized(true);
        } catch (err) {
          console.error("Error initializing GIS client", err);
          setError("Failed to initialize Google Identity Services.");
        }
      };

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = initGis;
      script.onerror = (e) => {
        console.error("Failed to load GIS script", e);
        setError("Failed to load Google Identity Services script.");
      };
      document.body.appendChild(script);
    };

    loadGapi();
    loadGis();
  }, []);

  // Persistence: Check for stored token on mount (after gapi init)
  useEffect(() => {
    if (gapiInitialized && !user) {
      const storedToken = localStorage.getItem("gdrive_token");
      const storedExpiry = localStorage.getItem("gdrive_token_expiry");
      const storedMode = localStorage.getItem("storage_mode");

      if (storedMode === "drive" && storedToken && storedExpiry) {
        const now = Date.now();
        if (now < parseInt(storedExpiry)) {
          console.log("Restoring session...");
          window.gapi.client.setToken({ access_token: storedToken });
          setStorageMode("drive");

          // Fetch user info to validate and populate UI
          fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Token invalid");
              return res.json();
            })
            .then((userInfo) => {
              setUser(userInfo);
            })
            .catch((err) => {
              console.warn("Stored token invalid or expired", err);
              // Clean up if invalid
              localStorage.removeItem("gdrive_token");
              localStorage.removeItem("gdrive_token_expiry");
              localStorage.removeItem("storage_mode");
              setStorageMode("none");
              setUser(null);
            });
        }
      }
    }
  }, [gapiInitialized]); // Run when gapi is ready

  // Auto-load tasks when user/mode changes
  useEffect(() => {
    if (user && storageMode !== "none") {
      loadTasks();
    }
  }, [user, storageMode]);

  const handleLogin = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("storage_mode", "guest");
    setStorageMode("guest");
    setUser({ name: "Guest", picture: null });
  };

  const handleLogout = () => {
    if (storageMode === "drive") {
      const token = window.gapi.client.getToken();
      if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
          window.gapi.client.setToken("");
          localStorage.removeItem("gdrive_token");
          localStorage.removeItem("gdrive_token_expiry");
          localStorage.removeItem("storage_mode");
          setStorageMode("none");
          setUser(null);
          setTasks([]);
        });
      } else {
        // Force cleanup even if token object is missing (e.g. expired session)
        localStorage.removeItem("gdrive_token");
        localStorage.removeItem("gdrive_token_expiry");
        localStorage.removeItem("storage_mode");
        setStorageMode("none");
        setUser(null);
        setTasks([]);
      }
    } else if (storageMode === "guest") {
      localStorage.removeItem("storage_mode");
      setStorageMode("none");
      setUser(null);
      setTasks([]);
    }
  };

  const getFolderId = async () => {
    // 1. Check if folder exists
    const response = await window.gapi.client.drive.files.list({
      q: `mimeType = 'application/vnd.google-apps.folder' and name = '${FOLDER_NAME}' and trashed = false`,
      fields: "files(id)",
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // 2. Create if not exists
    const folderMetadata = {
      name: FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    };

    const createResponse = await window.gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    return createResponse.result.id;
  };

  const listFiles = async () => {
    if (!window.gapi?.client?.drive) {
      throw new Error("Google Drive API not loaded yet.");
    }

    const folderId = await getFolderId();

    const response = await window.gapi.client.drive.files.list({
      q: `name = '${FILE_NAME}' and '${folderId}' in parents and trashed = false`,
      fields: "files(id, name)",
    });
    return response.result.files;
  };

  const createFile = async (initialData: Task[]) => {
    const folderId = await getFolderId();

    const fileContent = JSON.stringify(initialData);
    const file = new Blob([fileContent], { type: "application/json" });
    const metadata = {
      name: FILE_NAME,
      mimeType: "application/json",
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    const accessToken = window.gapi.auth.getToken().access_token;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: new Headers({ Authorization: "Bearer " + accessToken }),
        body: form,
      }
    );
    return response.json();
  };

  const updateFile = async (fileId: string, data: Task[]) => {
    const fileContent = JSON.stringify(data);

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: new Headers({
          Authorization: "Bearer " + window.gapi.auth.getToken().access_token,
          "Content-Type": "application/json",
        }),
        body: fileContent,
      }
    );

    return response.json();
  };

  const loadTasks = async (): Promise<Task[]> => {
    setIsSyncing(true);
    try {
      if (storageMode === "guest") {
        const loadedTasks = await dbHelper.getTasks();
        setTasks(loadedTasks);
        return loadedTasks;
      }

      // Drive Mode
      if (storageMode === "drive") {
        const files = await listFiles();
        if (files && files.length > 0) {
          const fileId = files[0].id;
          const response = await window.gapi.client.drive.files.get({
            fileId: fileId,
            alt: "media",
          });
          const loadedTasks = response.result as Task[];
          setTasks(loadedTasks);
          return loadedTasks;
        }
        setTasks([]);
        return [];
      }

      return [];
    } catch (err: any) {
      console.error("Error loading tasks:", err);
      if (
        storageMode === "drive" &&
        err?.result?.error?.message?.includes("API has not been used")
      ) {
        const projectId = err.result.error.message.match(/project (\d+)/)?.[1];
        const url = `https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=${projectId}`;
        setError(
          `Google Drive API is not enabled. Please enable it here: <a href="${url}" target="_blank" class="link link-accent">Enable API</a>`
        );
      }
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveTasks = async (newTasks: Task[]) => {
    // Optimistic update
    setTasks(newTasks);
    setIsSyncing(true);

    // Clear previous timeout (Debounce)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (storageMode === "guest") {
          await dbHelper.saveTasks(newTasks);
          setIsSyncing(false);
          return;
        }

        if (storageMode === "drive") {
          const files = await listFiles();
          if (files && files.length > 0) {
            const fileId = files[0].id;
            await updateFile(fileId, newTasks);
          } else {
            await createFile(newTasks);
          }
        }
      } catch (err: any) {
        console.error("Error saving tasks:", err);
        if (
          storageMode === "drive" &&
          err?.result?.error?.message?.includes("API has not been used")
        ) {
          const projectId =
            err.result.error.message.match(/project (\d+)/)?.[1];
          const url = `https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=${projectId}`;
          setError(
            `Google Drive API is not enabled. Please enable it here: <a href="${url}" target="_blank" class="link link-accent">Enable API</a>`
          );
        } else {
          setError(
            `Failed to save tasks: ${
              err.message || JSON.stringify(err.result?.error || err)
            }`
          );
        }
      } finally {
        setIsSyncing(false);
        saveTimeoutRef.current = null;
      }
    }, 2000); // Wait 2 seconds of inactivity before saving
  };

  const isReady = gapiInitialized && gisInitialized;

  return (
    <DriveContext.Provider
      value={{
        user,
        isReady,
        isSyncing,
        error,
        tasks,
        storageMode,
        setTasks,
        handleLogin,
        handleGuestLogin,
        handleLogout,
        loadTasks,
        saveTasks,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
}; // End of DriveProvider

export const useDriveContext = () => {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error("useDriveContext must be used within a DriveProvider");
  }
  return context;
};

// Backward compatibility or ease of refactor
export const useDrive = useDriveContext;
