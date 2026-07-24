import { Globe } from "lucide-react";
import { useLocale } from "../content/ContentProvider";
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  isSupportedLocale,
} from "../i18n/locale";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <label className="relative inline-flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/60">
      <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => {
          if (isSupportedLocale(e.target.value)) setLocale(e.target.value);
        }}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-sm font-medium outline-none"
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
