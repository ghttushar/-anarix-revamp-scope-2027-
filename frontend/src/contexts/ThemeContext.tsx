import { createContext, useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { runThemeTransition, type ThemeOrigin } from "@/lib/theme-transition";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  /** Switch theme. Pass the toggle's click point (originFromEvent) so the ink spreads from it. */
  setTheme: (theme: Theme, origin?: ThemeOrigin) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "anarix-theme";
const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const resolve = (t: Theme): "light" | "dark" => (t === "system" ? (systemDark() ? "dark" : "light") : t);

function applyRootClass(next: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(STORAGE_KEY) as Theme) || "light";
    }
    return "light";
  });

  // index.html already put the saved class on <html> before the first paint; start from it so nothing re-flips.
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" ? resolve(theme) : "light"
  );
  const resolvedRef = useRef(resolvedTheme);
  resolvedRef.current = resolvedTheme;

  /** One path for every switch: swap synchronously (class + flushed React state) inside the ink transition. */
  const switchTo = (nextTheme: Theme, origin?: ThemeOrigin) => {
    const next = resolve(nextTheme);
    if (next === resolvedRef.current) {
      setThemeState(nextTheme);
      return;
    }
    void runThemeTransition(() => {
      applyRootClass(next);
      flushSync(() => {
        setThemeState(nextTheme);
        setResolvedTheme(next);
      });
    }, origin);
  };

  // Mount: make sure <html> matches (normally a no-op). System mode: follow the OS, with the same transition.
  useEffect(() => {
    if (!document.documentElement.classList.contains(resolvedRef.current)) applyRootClass(resolvedRef.current);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => switchTo("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const setTheme = (newTheme: Theme, origin?: ThemeOrigin) => {
    localStorage.setItem(STORAGE_KEY, newTheme); // night stays night
    switchTo(newTheme, origin);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
