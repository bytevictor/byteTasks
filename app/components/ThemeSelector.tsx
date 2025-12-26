import { useEffect } from "react";
import { themeChange } from "theme-change";
import { useLanguage } from "@/app/components/hooks/LanguageHook";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

export default function ThemeSelector() {
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
      {/* Language Selector */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <span className="text-primary">🌐</span> {t("language")}
        </h2>
        <div className="join w-full grid grid-cols-2">
          <button
            className={`join-item btn ${
              language === "en" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setLanguage("en")}
          >
            🇺🇸 English
          </button>
          <button
            className={`join-item btn ${
              language === "es" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setLanguage("es")}
          >
            🇪🇸 Español
          </button>
        </div>
      </div>

      <div className="divider"></div>

      {/* Theme List - Collapsible */}
      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-xl font-bold flex items-center gap-2">
          <span className="text-primary">🎨</span> {t("theme.select")}
        </div>
        <div className="collapse-content bg-base-200/50 p-2">
          <div className="grid grid-cols-1 gap-3 pt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {THEMES.map((theme) => (
              <div
                key={theme}
                className="overflow-hidden rounded-box border border-base-content/10 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                data-set-theme={theme}
                data-theme={theme}
                data-act-class="theme-selected"
              >
                <div data-theme={theme} className="w-full block bg-transparent">
                  <div className="bg-base-100 text-base-content w-full p-3 flex items-center justify-between gap-4">
                    <span className="font-semibold capitalize tracking-wide text-sm">
                      {theme}
                    </span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                      <div className="w-3 h-3 rounded-full bg-neutral"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
