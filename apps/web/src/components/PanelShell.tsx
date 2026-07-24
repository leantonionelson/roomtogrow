import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import film1 from "../assets/film/film-1.jpg";
import film2 from "../assets/film/film-2.jpg";
import film3 from "../assets/film/film-3.jpg";

const HERO_IMAGES = [film1, film2, film3];

/** Deterministic hero per node, so a given place always looks the same. */
export function heroForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash + id.charCodeAt(i)) % 997;
  return HERO_IMAGES[hash % HERO_IMAGES.length];
}

export interface PanelTab {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Mini-app surface for the navigator's detail panel, modelled on a maps
 * place card: hero image, title block, optional tab bar, one scrollable body
 * and a pinned action bar. The shell owns the height so the panel never
 * grows the page — only its body scrolls.
 */
export default function PanelShell({
  eyebrow,
  title,
  subtitle,
  heroImage,
  heroIcon,
  accent = "primary",
  onClose,
  tabs,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroIcon?: ReactNode;
  /** Tints the hero scrim and marker chip. */
  accent?: "primary" | "orange";
  onClose?: () => void;
  /** When present, renders a tab bar; otherwise `children` is the body. */
  tabs?: PanelTab[];
  children?: ReactNode;
  /**
   * Pinned bottom action bar (primary CTA). Pass a function to receive a tab
   * setter, so the CTA can jump to a related tab (e.g. "Discuss with manager").
   */
  action?: ReactNode | ((setTab: (id: string) => void) => ReactNode);
}) {
  const firstTabId = tabs?.[0]?.id;
  const [activeTab, setActiveTab] = useState(firstTabId);
  const shownTitle = useRef(title);

  /**
   * Reset to the first tab only when a different place is shown. Keyed on the
   * title rather than the `tabs` array, which is rebuilt on every parent
   * render and would otherwise clobber the user's tab choice.
   */
  useEffect(() => {
    if (shownTitle.current !== title) {
      shownTitle.current = title;
      setActiveTab(firstTabId);
    }
  }, [title, firstTabId]);

  const body = tabs
    ? tabs.find((tab) => tab.id === (activeTab ?? tabs[0].id))?.content
    : children;

  const scrim =
    accent === "orange"
      ? "linear-gradient(to top, rgba(120,38,14,0.92), rgba(232,84,44,0.35) 60%, rgba(232,84,44,0.12))"
      : "linear-gradient(to top, rgba(16,32,40,0.92), rgba(31,68,86,0.42) 60%, rgba(31,68,86,0.15))";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Hero */}
      <div className="relative h-32 shrink-0 overflow-hidden">
        {heroImage ? (
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-muted" aria-hidden />
        )}
        <div className="absolute inset-0" aria-hidden style={{ background: scrim }} />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="glass-dark absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/25"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4">
          {heroIcon && (
            <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground shadow-sm">
              {heroIcon}
            </span>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/75">
                {eyebrow}
              </p>
            )}
            <h3 className="text-pretty text-base font-semibold leading-tight tracking-tight text-white">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {subtitle && (
        <p className="shrink-0 border-b px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      )}

      {/* Tab bar */}
      {tabs && tabs.length > 1 && (
        <div
          className="flex shrink-0 gap-1 border-b px-2 pt-2"
          role="tablist"
          aria-label={title}
        >
          {tabs.map((tab) => {
            const isActive = (activeTab ?? tabs[0].id) === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-t-lg px-3 pb-2.5 pt-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 [&>*]:shrink-0">{body}</div>

      {/* Pinned action bar */}
      {action && (
        <div className="shrink-0 border-t bg-card/80 p-3 backdrop-blur">
          {typeof action === "function" ? action(setActiveTab) : action}
        </div>
      )}
    </div>
  );
}
