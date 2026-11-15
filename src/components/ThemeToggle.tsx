"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

const themeKey = "portfolio-color-theme";
const changeEvent = "portfolio-theme-change";
// Dark (Terminal Black) is the brand default; light is opt-in.
type Theme = "dark" | "light";

function readTheme(): Theme {
  return localStorage.getItem(themeKey) === "light" ? "light" : "dark";
}
function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "dark" as Theme,
  );
  const next: Theme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const site = buttonRef.current?.closest<HTMLElement>(".public-site");
    if (!site) return;
    if (theme === "light") site.dataset.theme = "light";
    else delete site.dataset.theme;
  }, [theme]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-toggle"
      title={`Color theme: ${theme}`}
      aria-label={`Use ${next} color theme`}
      onClick={() => {
        if (next === "dark") localStorage.removeItem(themeKey);
        else localStorage.setItem(themeKey, next);
        window.dispatchEvent(new Event(changeEvent));
      }}
    >
      {theme === "dark" ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
}
