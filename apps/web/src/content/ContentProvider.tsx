import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Programme, Role, SiteContent, Story } from "../types/content";
import { getSiteContent } from "./siteContent";
import {
  detectLocale,
  localeDir,
  persistLocale,
  type Locale,
} from "../i18n/locale";
import { STRINGS, type StringKey, type Translate } from "../i18n/strings";

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

/** Site content in the active locale (English for anything untranslated). */
export function useSiteContent(): SiteContent {
  const { locale } = useContext(LocaleContext);
  return getSiteContent(locale);
}

/** Id lookups into the active locale's content (roles, programmes, stories). */
export function useContentLookup() {
  const content = useSiteContent();
  return useMemo(
    () => ({
      role: (id: string | null | undefined): Role | null =>
        (id && content.roles.find((r) => r.id === id)) || null,
      programme: (id: string | null | undefined): Programme | null =>
        (id && content.programmes.find((p) => p.id === id)) || null,
      story: (id: string | null | undefined): Story | null =>
        (id && content.stories.find((s) => s.id === id)) || null,
    }),
    [content],
  );
}

export function useLocale(): LocaleState {
  return useContext(LocaleContext);
}

/** Translate a UI chrome string for the active locale (English fallback). */
export function useT(): Translate {
  const { locale } = useContext(LocaleContext);
  return useCallback(
    (key: StringKey, vars?: Record<string, string>) => {
      const template = STRINGS[locale][key] ?? STRINGS.en[key] ?? key;
      return vars
        ? template.replace(/\{(\w+)\}/g, (match, name: string) => vars[name] ?? match)
        : template;
    },
    [locale],
  );
}
