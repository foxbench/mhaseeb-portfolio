import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { config } from "../config";

const ThemeContext = createContext(null);

const STORAGE_THEME = "portfolio-theme";
const STORAGE_MODE = "portfolio-mode";

export const THEMES = [
  { id: "emerald", label: "Emerald", color: "#10b981" },
  { id: "ocean", label: "Ocean", color: "#3b82f6" },
  { id: "ember", label: "Ember", color: "#f59e0b" },
  { id: "violet", label: "Violet", color: "#8b5cf6" },
];

function getSystemMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(mode) {
  return mode === "system" ? getSystemMode() : mode;
}

function applyToDOM(theme, resolved) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.mode = resolved;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_THEME) || config.defaultTheme;
  });

  const [mode, setModeState] = useState(() => {
    return localStorage.getItem(STORAGE_MODE) || config.defaultMode;
  });

  const [resolvedMode, setResolvedMode] = useState(() => resolveMode(
    localStorage.getItem(STORAGE_MODE) || config.defaultMode
  ));

  // Apply theme + mode to DOM
  useEffect(() => {
    const resolved = resolveMode(mode);
    setResolvedMode(resolved);
    applyToDOM(theme, resolved);
  }, [theme, mode]);

  // Listen for system color scheme changes when mode is "system"
  useEffect(() => {
    if (mode !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = getSystemMode();
      setResolvedMode(resolved);
      applyToDOM(theme, resolved);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [mode, theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_THEME, t);
  }, []);

  const setMode = useCallback((m) => {
    setModeState(m);
    localStorage.setItem(STORAGE_MODE, m);
  }, []);

  // Cycle: dark → light → system → dark
  const cycleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ theme, mode, resolvedMode, setTheme, setMode, cycleMode }),
    [theme, mode, resolvedMode, setTheme, setMode, cycleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
