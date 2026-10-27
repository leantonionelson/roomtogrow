import { useT } from "../content/ContentProvider";
import IhgUniversityLogo from "./brand/IhgUniversityLogo";

export default function Footer() {
  const t = useT();
  return (
    <footer className="bg-brand-navy px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:px-2 lg:px-4">
        <IhgUniversityLogo className="h-7 w-auto" />

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85"
          aria-label={t("a11y.footerNav")}
        >
          <a href="#faq" className="transition-colors hover:text-white">
            {t("footer.faq")}
          </a>
          <a href="#accessibility" className="transition-colors hover:text-white">
            {t("footer.accessibility")}
          </a>
          <a href="#privacy" className="transition-colors hover:text-white">
            {t("footer.privacy")}
          </a>
          <a href="#legal" className="transition-colors hover:text-white">
            {t("footer.legal")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
