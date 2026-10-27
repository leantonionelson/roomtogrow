import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { SiteContent } from "../types/content";
import { siteContent } from "./siteContent";
import {
  detectLocale,
  localeDir,
  persistLocale,
  type Locale,
} from "../i18n/locale";
import { STRINGS, type StringKey } from "../i18n/strings";

interface LocaleState {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleState>({
  locale: "en",
  dir: "ltr",
  setLocale: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    setLocaleState(next);
  }, []);

  // Reflect language + direction on the document (Arabic is RTL).
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, dir: localeDir(locale), setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Site content (English; bundled from the content model). */
export function useSiteContent(): SiteContent {
  return siteContent;
}

export function useLocale(): LocaleState {
  return useContext(LocaleContext);
}

/** Translate a UI chrome string for the active locale (English fallback). */
export function useT(): (key: StringKey) => string {
  const { locale } = useContext(LocaleContext);
  return useCallback(
    (key: StringKey) => STRINGS[locale][key] ?? STRINGS.en[key] ?? key,
    [locale],
  );
}
