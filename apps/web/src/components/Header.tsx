import { Button } from "@/components/ui/button";
import { useT } from "../content/ContentProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useT();
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-3 rounded-full bg-white/95 py-1 pl-5 pr-1.5 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur">
        <a
          href="#top"
          className="text-sm font-medium tracking-tight text-brand-navy"
        >
          Room to Grow
        </a>

        <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Primary">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden rounded-full text-brand-navy hover:bg-brand-navy/5 hover:text-brand-navy sm:inline-flex"
          >
            <a href="#faq">{t("nav.faq")}</a>
          </Button>
          <Button
            size="sm"
            asChild
            className="hidden rounded-full bg-brand-navy px-4 text-white hover:bg-brand-navy/90 sm:inline-flex"
          >
            <a href="#growth-navigator">{t("nav.openNavigator")}</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
