import { Button } from "@/components/ui/button";
import { useT } from "../content/ContentProvider";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Floating controls in the top corner: language, FAQ and the Navigator. No
 * wordmark (the hero carries the IHG University logo), and kept compact so
 * it doesn't read as a search bar.
 */
export default function Header() {
  const t = useT();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-5xl justify-end">
        <nav
          className="pointer-events-auto flex h-11 items-center gap-1 rounded-full bg-white/95 p-1 shadow-lg shadow-black/10 ring-1 ring-black/5 backdrop-blur sm:gap-1.5"
          aria-label={t("a11y.primaryNav")}
        >
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
