import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ZTheme = "dark" | "light" | "system";

interface ZProviderContextValue {
  theme: ZTheme;
  setTheme: (theme: ZTheme) => void;
  resolvedTheme: "dark" | "light";
}

const ZProviderContext = createContext<ZProviderContextValue | null>(null);

export interface ZProviderProps {
  /** Children components */
  children: ReactNode;
  /** Initial theme */
  defaultTheme?: ZTheme;
  /** Force a specific theme */
  forcedTheme?: "dark" | "light";
  /** Storage key for persisting theme */
  storageKey?: string;
  /** Disable system theme detection */
  disableSystemTheme?: boolean;
}

/**
 * ZProvider - Zurto UI Provider Component
 * Provides theme context and CSS variable injection
 */
export function ZProvider({
  children,
  defaultTheme = "dark",
  forcedTheme,
  storageKey = "zurto-theme",
  disableSystemTheme = false,
}: ZProviderProps) {
  const [theme, setThemeState] = useState<ZTheme>(() => {
    if (forcedTheme) return forcedTheme;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored === "dark" || stored === "light" || stored === "system") {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  // Detect system theme
  useEffect(() => {
    if (disableSystemTheme || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [disableSystemTheme]);

  const resolvedTheme =
    forcedTheme ?? (theme === "system" ? systemTheme : theme);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: ZTheme) => {
    if (forcedTheme) return;
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  return (
    <ZProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ZProviderContext.Provider>
  );
}

/**
 * useZTheme - Hook to access theme context
 */
export function useZTheme() {
  const context = useContext(ZProviderContext);
  if (!context) {
    throw new Error("useZTheme must be used within a ZProvider");
  }
  return context;
}

export default ZProvider;
