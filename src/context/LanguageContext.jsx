import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { en } from "../i18n/en";
import { hi } from "../i18n/hi";

const LanguageContext = createContext(null);

const TRANSLATIONS = {
  en,
  hi,
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage =
      localStorage.getItem("pos-language");

    if (savedLanguage === "en" || savedLanguage === "hi") {
      return savedLanguage;
    }

    return "en";
  });

  const changeLanguage = (newLanguage) => {
    if (!TRANSLATIONS[newLanguage]) {
      return;
    }

    setLanguage(newLanguage);
    localStorage.setItem(
      "pos-language",
      newLanguage
    );
  };

  const t = (key) => {
    return (
      TRANSLATIONS[language]?.[key] ||
      TRANSLATIONS.en[key] ||
      key
    );
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      t,
    }),
    [language]
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
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}