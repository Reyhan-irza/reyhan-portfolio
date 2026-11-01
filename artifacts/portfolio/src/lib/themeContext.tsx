import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const storageKey = "rv-theme";
function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "dark" || value === "light" ? value : null;
  } catch { return null; }
}
function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeCtx { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<Theme | null>(savedTheme);
  const [system, setSystem] = useState<Theme>(systemTheme);
  const theme = preference ?? system;
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystem(systemTheme());
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) setPreference(savedTheme());
    };
    query.addEventListener("change", update);
    window.addEventListener("storage", sync);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#101113" : "#f4f3ef");
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setPreference(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Retain the in-memory choice when storage is blocked. */ }
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
