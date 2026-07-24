import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { SiteContent } from "../types/content";
import { fallbackContent } from "./fallback";
import { fetchSiteContent, getCmsUrl } from "./client";
import {
  detectLocale,
  localeDir,
  persistLocale,
  type Locale,
} from "../i18n/locale";
import { STRINGS, type StringKey } from "../i18n/strings";

interface ContentState {
  content: SiteContent;
  /** "fallback" until the CMS responds; the page renders either way. */
  source: "fallback" | "cms";
}

const ContentContext = createContext<ContentState>({
  content: fallbackContent,
  source: "fallback",
});

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
  const [state, setState] = useState<ContentState>({
    content: fallbackContent,
    source: "fallback",
  });

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next);
    setLocaleState(next);
  }, []);

  // Reflect language + direction on the document (Arabic is RTL).
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);

  useEffect(() => {
    const cmsUrl = getCmsUrl();
    if (!cmsUrl) return;
    let cancelled = false;
    fetchSiteContent(cmsUrl, locale)
      .then((content) => {
        if (!cancelled) setState({ content, source: "cms" });
      })
      .catch((err) => {
        console.warn("CMS unreachable, using built-in content:", err);
        // Keep whatever we already have; English fallback at worst.
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, dir: localeDir(locale), setLocale }}>
      <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
    </LocaleContext.Provider>
  );
}

/** Current site content: CMS-backed when available, static fallback otherwise. */
export function useSiteContent(): SiteContent {
  return useContext(ContentContext).content;
}

export function useContentSource(): "fallback" | "cms" {
  return useContext(ContentContext).source;
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
