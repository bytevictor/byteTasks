"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "byteTasks",
    "app.subtitle": "Manage, sync, and organize your tasks effortlessly.",
    login: "Login",
    logout: "Sign Out",
    connected: "Connected",
    syncing: "Syncing...",
    synced: "Synced",
    error: "Error",
    "task.placeholder": "What needs to be done?",
    "task.empty.title": "No tasks yet",
    "task.empty.subtitle": "Add one above to get started!",
    my_tasks: "My Tasks",
    manage_description: "Manage your tasks synced with Google Drive.",
    "theme.select": "Select Theme",
    settings: "Settings",
    language: "Language",
    welcome: "Welcome",
    guest: "Guest",
  },
  es: {
    "app.title": "byteTasks",
    "app.subtitle": "Gestiona, sincroniza y organiza tus tareas sin esfuerzo.",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    connected: "Conectado",
    syncing: "Sincronizando...",
    synced: "Sincronizado",
    error: "Error",
    "task.placeholder": "¿Qué necesitas hacer?",
    "task.empty.title": "No hay tareas aún",
    "task.empty.subtitle": "¡Añade una arriba para empezar!",
    my_tasks: "Mis Tareas",
    manage_description: "Gestiona tus tareas sincronizadas con Google Drive.",
    "theme.select": "Seleccionar Tema",
    settings: "Ajustes",
    language: "Idioma",
    welcome: "Bienvenido",
    guest: "Invitado",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to English, or try to persist later
  const [language, setLanguage] = useState<Language>("en");

  // Optional: Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "es")) {
      setLanguage(saved);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
