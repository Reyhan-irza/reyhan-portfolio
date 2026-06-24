import { createContext, useContext } from "react";

type Theme = "dark";

interface ThemeCtx { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
