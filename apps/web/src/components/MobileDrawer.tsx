import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useT } from "../content/ContentProvider";

/** Matches Tailwind's `md` breakpoint: drawer exists only below it. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    // Some environments don't dispatch matchMedia "change" on viewport
    // changes; plain resize events are the reliable fallback.
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return isMobile;
}

export default function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const isMobile = useIsMobile();
  const t = useT();

  // App sets `open` on node clicks at any width; on md+ the sidebar shows the
  // same panel, so the drawer (and its portalled overlay) must not mount.
  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="bottom"
        className="max-h-[70vh] overflow-auto rounded-t-lg p-0 md:hidden"
        overlayClassName="md:hidden"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">{t("drawer.title")}</SheetTitle>
        <div className="min-h-[200px]">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
