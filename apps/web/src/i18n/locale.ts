/**
 * Locale support: auto-detect from the browser with manual override
 * (persisted), falling back to English. Arabic renders right-to-left.
 */
export const SUPPORTED_LOCALES = ["en", "fr", "es", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

const RTL_LOCALES: readonly Locale[] = ["ar"];

const STORAGE_KEY = "rtg-locale";

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  );
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

/** Manual override first, then browser languages, then English. */
export function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;
  } catch {
    // storage unavailable (e.g. sandboxed iframe) — fall through to detection
  }
  const candidates = navigator.languages ?? [navigator.language];
  for (const lang of candidates) {
    const base = lang?.slice(0, 2).toLowerCase();
    if (isSupportedLocale(base)) return base;
  }
  return "en";
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // non-fatal: override simply won't survive a reload
  }
}
