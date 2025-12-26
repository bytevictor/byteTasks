import { Keyboard } from "lucide-react";
import { useLanguage } from "./hooks/LanguageHook";

export default function ShortcutsPanel() {
  const { t } = useLanguage();

  const shortcuts = [
    { key: "Ctrl + N", description: t("shortcuts.add") },
    { key: "Esc", description: t("shortcuts.cancel") },
    { key: "Double Click", description: t("shortcuts.edit") },
    { key: "Drag", description: "Reorder" },
  ];

  return (
    <div className="fixed top-24 left-4 z-50 group hidden sm:block">
      {/* Icon Circle (Always visible, clean, no morphing) */}
      <div className="w-10 h-10 bg-base-100 rounded-full shadow-lg flex items-center justify-center border border-base-300 hover:border-primary hover:text-primary transition-colors duration-300">
        <Keyboard className="w-6 h-6 text-base-content/70 group-hover:text-primary transition-colors" />
      </div>

      {/* Popover Content (Appears to the right) */}
      <div
        className="absolute top-0 left-14 bg-base-100/95 backdrop-blur-xl shadow-xl border border-base-300 rounded-xl p-4 w-64 
                      opacity-0 invisible -translate-x-2 scale-95
                      group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 group-hover:scale-100
                      transition-all duration-300 ease-out origin-left"
      >
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary">
          <Keyboard className="w-4 h-4" />
          {t("shortcuts.title")}
        </h3>
        <div className="flex flex-col gap-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex justify-between items-center text-xs"
            >
              <span className="text-base-content/70 font-medium">
                {s.description}
              </span>
              <kbd className="kbd kbd-sm bg-base-200 border-base-300 font-mono">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
