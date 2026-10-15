"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

const themeKey = "portfolio-color-theme";
const changeEvent = "portfolio-theme-change";
const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

function readTheme(): Theme {
  const stored = localStorage.getItem(themeKey);
  return stored === "light" || stored === "dark" ? stored : "system";
}
function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}
function subscribeSystem(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "system" as Theme,
  );
  const next = themes[(themes.indexOf(theme) + 1) % themes.length];
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
  const dark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    const site = buttonRef.current?.closest<HTMLElement>(".public-site");
    if (!site) return;
    if (theme === "system") delete site.dataset.theme;
    else site.dataset.theme = theme;
  }, [theme]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="theme-toggle"
      title={`Color theme: ${theme}`}
      aria-label={`Use ${next} color theme`}
      onClick={() => {
        if (next === "system") localStorage.removeItem(themeKey);
        else localStorage.setItem(themeKey, next);
        window.dispatchEvent(new Event(changeEvent));
      }}
    >
      {dark ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" />
      )}
    </button>
  );
}
