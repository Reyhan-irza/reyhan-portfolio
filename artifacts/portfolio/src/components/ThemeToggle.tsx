import { m, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const reduced = useReducedMotion();
  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme}
      aria-label="Dark mode" aria-pressed={theme === "dark"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <m.span key={theme} initial={reduced ? false : { rotate: -45, opacity: 0, scale: .75 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : .3, ease: [.22, 1, .36, 1] }}>
        {theme === "dark" ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      </m.span>
    </button>
  );
}
