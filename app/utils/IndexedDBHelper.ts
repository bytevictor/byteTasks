import { Task } from "@/app/components/hooks/DriveHook";

const DB_NAME = "ByteTasksDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

export class IndexedDBHelper {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event);
        reject("Failed to open database");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("Database not initialized");

      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Task[]);
      };

      request.onerror = () => {
        reject("Failed to fetch tasks");
      };
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) return reject("Database not initialized");

      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing and add new (simplest sync approach for full list replace)
      // A more optimized way would be diffing, but for this app size, this is fine.
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        let completed = 0;
        if (tasks.length === 0) {
          resolve();
          return;
        }

        tasks.forEach((task) => {
          const addRequest = store.add(task);
          addRequest.onsuccess = () => {
            completed++;
            if (completed === tasks.length) {
              resolve();
            }
          };
          addRequest.onerror = (e) => {
            console.error("Error saving task", task, e);
            // We continue, but you might want to reject.
            // For now, let's resolve if best effort.
          };
        });
      };

      clearRequest.onerror = () => {
        reject("Failed to clear old tasks");
      };

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject("Transaction error");
      };
    });
  }
}

export const dbHelper = new IndexedDBHelper();
