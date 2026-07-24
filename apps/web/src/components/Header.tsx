import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "../content/ContentProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useT();
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="glass mx-auto flex h-13 max-w-5xl items-center justify-between gap-3 rounded-full py-1 pl-4 pr-2 shadow-lg shadow-primary/10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Sprout className="h-4.5 w-4.5" aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Room to Grow
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              IHG University
            </span>
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-1.5" aria-label="Primary">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden rounded-full text-muted-foreground sm:inline-flex"
          >
            <a href="#faq">{t("nav.faq")}</a>
          </Button>
          <Button
            size="sm"
            asChild
            className="hidden rounded-full shadow-sm sm:inline-flex"
          >
            <a href="#growth-navigator">{t("nav.openNavigator")}</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
