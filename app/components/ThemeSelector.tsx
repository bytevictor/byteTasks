"use client";

import { useEffect } from "react";
import { themeChange } from "theme-change";

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
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div className="p-4 w-80 min-h-full bg-base-200 text-base-content">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-primary">🎨</span> Select Theme
      </h2>
      <div className="grid grid-cols-1 gap-4 pb-20">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className="overflow-hidden rounded-xl border border-base-content/10 shadow-sm hover:shadow-md transition-all duration-200"
            data-set-theme={theme}
            data-act-class="theme-active"
          >
            <div
              data-theme={theme}
              className="w-full h-full block bg-transparent"
            >
              <div className="bg-base-100 text-base-content w-full h-full cursor-pointer font-sans p-3 flex items-center justify-between gap-4">
                <span className="font-semibold capitalize tracking-wide">
                  {theme}
                </span>
                <div className="flex gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary ring-1 ring-base-content/20"></div>
                  <div className="w-5 h-5 rounded-full bg-secondary ring-1 ring-base-content/20"></div>
                  <div className="w-5 h-5 rounded-full bg-accent ring-1 ring-base-content/20"></div>
                  <div className="w-5 h-5 rounded-full bg-neutral ring-1 ring-base-content/20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
