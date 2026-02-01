// Embedded translations to avoid import issues during build
// Using direct JSON imports with ?raw suffix

import enTranslationsJson from '../locales/en.json?raw';
import jaTranslationsJson from '../locales/ja.json?raw';

export type Locale = "en" | "ja";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enTranslations = JSON.parse(enTranslationsJson) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jaTranslations = JSON.parse(jaTranslationsJson) as any;

const supportedLocales: Locale[] = ["en", "ja"];

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const saved = localStorage.getItem("locale");
  if (saved && supportedLocales.includes(saved as Locale)) {
    return saved as Locale;
  }

  const browserLocale = navigator.language.split("-")[0];
  return browserLocale === "ja" ? "ja" : "en";
}

function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = locale === "ja" ? jaTranslations : enTranslations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Key not found, return the key itself
      return key;
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace parameters in the string
  if (params) {
    let result = value;
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue));
    }
    return result;
  }

  return value;
}

let currentLocaleInternal: Locale = detectLocale();

export function setLocale(locale: Locale): void {
  if (supportedLocales.includes(locale)) {
    currentLocaleInternal = locale;
    localStorage.setItem("locale", locale);
  }
}

export function getLocale(): Locale {
  return currentLocaleInternal;
}

// Initialize from localStorage or auto-detect
export function initLocale(): void {
  const saved = localStorage.getItem("locale");
  if (saved && supportedLocales.includes(saved as Locale)) {
    currentLocaleInternal = saved as Locale;
  } else {
    currentLocaleInternal = detectLocale();
  }
}

// React hook for translations
import { useState, useEffect, useCallback } from "react";

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(currentLocaleInternal);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "locale") {
        const newLocale = getLocale();
        setLocaleState(newLocale);
      }
    };

    const localeHandler = (e: Event) => {
      const customEvent = e as CustomEvent<{ locale: Locale }>;
      if (customEvent.detail && customEvent.detail.locale) {
        setLocaleState(customEvent.detail.locale);
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("localeChanged", localeHandler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("localeChanged", localeHandler);
    };
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    if (supportedLocales.includes(newLocale)) {
      currentLocaleInternal = newLocale;
      localStorage.setItem("locale", newLocale);
      setLocaleState(newLocale);
      window.dispatchEvent(new CustomEvent("localeChanged", { detail: { locale: newLocale } }));
    }
  }, []);

  return {
    t: (key: string, params?: Record<string, string | number>) => t(key, locale, params),
    locale,
    setLocale: changeLocale,
    isEnglish: locale === "en",
    isJapanese: locale === "ja",
  };
}
