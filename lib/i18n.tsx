"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  siteContent,
  uiCopy,
  type Language,
} from "@/content/site-content";

const STORAGE_KEY = "encomm-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  content: (typeof siteContent)[Language];
  copy: (typeof uiCopy)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = "en",
  followStoredPreference = true,
}: {
  children: ReactNode;
  initialLanguage?: Language;
  followStoredPreference?: boolean;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const routeLanguage = window.location.pathname.match(/^\/(en|el)(?:\/|$)/)?.[1];
    if (routeLanguage === "en" || routeLanguage === "el") {
      document.documentElement.lang = routeLanguage;
      return;
    }

    document.documentElement.lang = initialLanguage;
    if (!followStoredPreference) return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "el") {
      // The stored preference is an external browser value synchronized after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, [followStoredPreference, initialLanguage]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      content: siteContent[language],
      copy: uiCopy[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
