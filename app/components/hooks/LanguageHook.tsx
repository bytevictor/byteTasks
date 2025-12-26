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
    "app.subtitle":
      "Create, Manage, Sync and Save your tasks for free on your own Google Drive. Frontend-Only - 100% privacy",
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
    "shortcuts.title": "Keyboard Shortcuts",
    "shortcuts.add": "Add Task",
    "shortcuts.edit": "Edit Task",
    "shortcuts.save": "Save Changes",
    "shortcuts.cancel": "Cancel Edit",
    "shortcuts.delete": "Delete Task",
    "shortcuts.double_click": "Double Click",
    settings: "Settings",
    language: "Language",
    welcome: "Welcome",
    guest: "Guest",
    continue_guest: "Continue as Guest",
    guest_login_desc: "Your data is saved on this device only.",
  },
  es: {
    "app.title": "byteTasks",
    "app.subtitle":
      "Crea, Gestiona, Sincroniza y Guarda tus tareas gratis en tú propio Google Drive. Frontend-Only - 100% privacidad",
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
    "shortcuts.title": "Atajos de Teclado",
    "shortcuts.add": "Añadir Tarea",
    "shortcuts.edit": "Editar Tarea",
    "shortcuts.save": "Guardar Cambios",
    "shortcuts.cancel": "Cancelar Edición",
    "shortcuts.delete": "Borrar Tarea",
    "shortcuts.double_click": "Doble Clic",
    settings: "Ajustes",
    language: "Idioma",
    welcome: "Bienvenido",
    guest: "Invitado",
    continue_guest: "Continuar como Invitado",
    guest_login_desc: "Tus datos se guardan solo en este dispositivo.",
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
