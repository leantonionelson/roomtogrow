import { Sprout } from "lucide-react";
import { useT } from "../content/ContentProvider";

export default function Footer() {
  const t = useT();
  return (
    <footer className="border-t bg-background px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sprout className="h-4 w-4" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Room to Grow</p>
            <p className="text-xs text-muted-foreground">IHG University</p>
          </div>
        </div>

        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <a href="#faq" className="transition-colors hover:text-foreground">
            {t("footer.faq")}
          </a>
          <a href="#accessibility" className="transition-colors hover:text-foreground">
            {t("footer.accessibility")}
          </a>
          <a href="#privacy" className="transition-colors hover:text-foreground">
            {t("footer.privacy")}
          </a>
          <a href="#legal" className="transition-colors hover:text-foreground">
            {t("footer.legal")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
