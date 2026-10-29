import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { useSiteContent, useT } from "../content/ContentProvider";
import {
  useMediaQuery,
  useNavigatorPinned,
  usePrefersReducedMotion,
  useStickyProgress,
} from "../lib/motion";
import { SUPPORTING_TEAM_ID } from "../lib/anchors";
import Container from "./Container";
import { Reveal } from "./motion";
import { ShieldTileIcon } from "./brand/ShieldArt";
import type { ShieldTile } from "./brand/ShieldArt";
import laptop from "../assets/brand/laptop.jpg";
import colleagueSmile from "../assets/brand/colleague-smile.jpg";
import teamLaptop from "../assets/brand/team-laptop.jpg";
import colleagueConversation from "../assets/brand/colleague-conversation.jpg";
import deskColleagues from "../assets/brand/desk-colleagues.jpg";

/**
 * Per stage (guidance, then each step): photograph, and the shield tile +
 * accent that mark it. Cycles if IHG adds more steps.
 */
const STAGES: { src: string; focus: string; tile: ShieldTile; accent: string }[] = [
  { src: laptop, focus: "50% 60%", tile: "house", accent: "var(--brand-teal)" },
  { src: colleagueSmile, focus: "35% 40%", tile: "person", accent: "var(--brand-orange)" },
  { src: teamLaptop, focus: "50% 30%", tile: "arch", accent: "var(--brand-blue)" },
  { src: colleagueConversation, focus: "40% 30%", tile: "leaf", accent: "var(--brand-teal)" },
  { src: deskColleagues, focus: "58% 45%", tile: "house", accent: "var(--brand-yellow)" },
];

const stageAt = (i: number) => STAGES[i % STAGES.length];

/**
 * Scroll per stage while the screen is pinned (vh). The pinned screen holds
 * the heading, the photo/timeline and the top of the FAQ band, so spacing
 * stays constant while the steps change.
 */
const STAGE_VH = 30;

/**
 * Height of the warm-white strip along the bottom of the pinned screen. It is
 * the top of the FAQ band: when the pin releases it runs straight into the
 * FAQ section (whose own top padding is reduced on desktop to match).
 */
const FAQ_STRIP = "h-14";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Supporting your team": a large photograph beside a numbered timeline —
 * the guidance list, then each quick action. On desktop windows tall enough
 * to hold it, the whole screen pins (heading, photo/timeline, FAQ band edge)
 * and scrolling advances the timeline. Phones, short windows and reduced
 * motion get the same timeline fully open, unpinned.
 */
export default function ManagerSupportSection() {
  const { managerGuidance, leaderActionSteps } = useSiteContent();
  const t = useT();
  const reducedMotion = usePrefersReducedMotion();
  const fitsPinned = useMediaQuery("(min-width: 768px) and (min-height: 860px)");
  const [trackRef, progress] = useStickyProgress<HTMLDivElement>();
  // The pinned Navigator above ends with a 48px spacer (so its frame isn't
  // flush with the screen edge while pinned); tuck up over it so the gap
  // between the two sections stays 96px.
  const tuck = useNavigatorPinned() ? "-mt-12" : "";

  const interactive = fitsPinned && !reducedMotion;
  const stages = 1 + leaderActionSteps.length;
  const active = interactive ? Math.min(stages - 1, Math.floor(progress * stages)) : 0;

  /** Scroll the page to where the given stage is the open one. */
  const goToStage = (stage: number) => {
    const el = trackRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((stage + 0.5) / stages) * travel, behavior: "smooth" });
  };

  const header = (
    <div className="text-center">
      <h2 id="manager-support-heading" className="text-2xl font-normal text-primary md:text-[2rem]">
        {t("managers.heading")}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-muted-foreground">
        {t("managers.sub")}
      </p>
    </div>
  );

  const photo = (
    <div className="relative md:h-full">
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden bg-muted ${
          interactive ? "md:aspect-auto md:h-full" : "md:aspect-[4/5]"
        }`}
      >
        {STAGES.slice(0, Math.min(stages, STAGES.length)).map((stage, i) => {
          const shown = i === active % STAGES.length;
          return (
            <img
              key={stage.src}
              src={stage.src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                shown ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
              style={{ objectPosition: stage.focus }}
            />
          );
        })}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
        {interactive && (
          <span className="absolute bottom-5 start-5 font-heading text-sm tabular-nums tracking-wide text-white [font-stretch:125%]">
            {pad(active + 1)} <span className="text-white/60">/ {pad(stages)}</span>
          </span>
        )}
      </div>
      {/* Shield tile in the stage's accent, overhanging the corner. */}
      <ShieldTileIcon
        tile={stageAt(active).tile}
        className="pointer-events-none absolute -bottom-7 -end-6 h-24 w-auto transition-colors duration-700 md:-end-10 md:h-32"
        style={{ color: stageAt(active).accent }}
      />
    </div>
  );

  const timeline = (
    <div className="flex flex-col">
      <ol>
        <Stage
          index={0}
          active={active}
          interactive={interactive}
          last={false}
          label={t("managers.col1")}
          preview={managerGuidance[0]}
          onSelect={goToStage}
        >
          <ul className="space-y-2">
            {managerGuidance.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-(--accent)" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Stage>
      </ol>

      <p className="mb-3 mt-2 ps-12 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {t("managers.col2")}
      </p>

      <ol>
        {leaderActionSteps.map((item, i) => (
          <Stage
            key={item}
            index={i + 1}
            active={active}
            interactive={interactive}
            last={i === leaderActionSteps.length - 1}
            label={`${t("managers.step")} ${i + 1}`}
            preview={item}
            onSelect={goToStage}
          >
            <p className="font-heading text-lg leading-snug text-primary [font-stretch:125%] md:text-xl">
              {item}
            </p>
          </Stage>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap gap-2.5 ps-12">
        <ShareButton />
        <a
          href="#growth-navigator"
          className="group inline-flex h-10 items-center gap-2 rounded-full border border-primary/25 px-4 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("nav.openNavigator")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden />
        </a>
      </div>
    </div>
  );

  if (!interactive) {
    return (
      <section
        id={SUPPORTING_TEAM_ID}
        className={`bg-background pt-16 md:pt-24 ${tuck}`}
        aria-labelledby="manager-support-heading"
      >
        <Container className="pb-16 md:pb-24">
          <Reveal>{header}</Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-start md:gap-16 lg:gap-20">
            {photo}
            {timeline}
          </div>
        </Container>
        {/* Same FAQ band edge as the pinned layout, so the FAQ spacing matches. */}
        <div className={`${FAQ_STRIP} hidden bg-muted md:block`} aria-hidden />
      </section>
    );
  }

  return (
    <section
      id={SUPPORTING_TEAM_ID}
      className={tuck}
      aria-labelledby="manager-support-heading"
      // Land on the pinned screen itself (the global [id] anchor offset is
      // unlayered CSS, so it is overridden inline).
      style={{ scrollMarginTop: 0 }}
    >
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `calc(100vh + ${stages * STAGE_VH}vh)` }}
      >
        {/* One pinned screen with the page's standard rhythm: 96px clear of
            the nav (more on very tall screens), heading, 48px, photo/timeline
            (which absorbs the rest of the height, up to 820px), 96px, then
            the FAQ band's top edge. */}
        <div className="sticky top-0 flex h-screen flex-col bg-background">
          <div className="min-h-24 flex-1" aria-hidden />
          <Container className="shrink-0">{header}</Container>
          <Container className="mt-12 min-h-0 flex-[0_1_820px]">
            {/* Row height is the photo's, so the photo holds still while the
                open stage changes; the timeline centres against it. */}
            <div className="grid h-full w-full grid-cols-[minmax(0,5fr)_minmax(0,6fr)] grid-rows-[100%] gap-16 lg:gap-20">
              <div className="h-full">{photo}</div>
              <div className="flex h-full flex-col justify-center">{timeline}</div>
            </div>
          </Container>
          <div className="h-24 shrink-0" aria-hidden />
          <div className={`${FAQ_STRIP} shrink-0 bg-muted`} aria-hidden />
        </div>
      </div>
    </section>
  );
}

/**
 * One timeline row: numbered marker on a rail, label, a one-line preview
 * while closed, and the full content while open. The rail below a stage
 * fills once the reader has passed it.
 */
function Stage({
  index,
  active,
  interactive,
  last,
  label,
  preview,
  onSelect,
  children,
}: {
  index: number;
  active: number;
  interactive: boolean;
  last: boolean;
  label: string;
  preview: string;
  onSelect: (index: number) => void;
  children: ReactNode;
}) {
  const open = !interactive || index === active;
  const done = interactive && index < active;
  const { tile, accent } = stageAt(index);

  return (
    <li
      className="relative pb-4 ps-12"
      style={{ "--accent": accent } as CSSProperties}
    >
      {!last && (
        <span className="absolute bottom-0 start-[15px] top-9 w-px bg-border" aria-hidden>
          <span
            className="absolute inset-x-0 top-0 bg-primary transition-all duration-700"
            style={{ height: done ? "100%" : "0%" }}
          />
        </span>
      )}

      {/* The button stretches back over the marker (-ms-12 / ps-12), so the
          step number is part of the click target, not just the label. */}
      <button
        type="button"
        onClick={() => onSelect(index)}
        disabled={!interactive}
        aria-current={interactive && open ? "step" : undefined}
        className={`group -ms-12 block rounded ps-12 pt-1 text-start text-sm transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default ${
          open ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span
          className={`absolute start-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-all duration-500 ${
            open
              ? "border-transparent bg-(--accent) text-white shadow-md"
              : done
                ? "border-primary bg-primary text-primary-foreground group-hover:bg-primary/85"
                : "border-border bg-background text-muted-foreground group-enabled:group-hover:border-primary group-enabled:group-hover:text-primary"
          }`}
          aria-hidden
        >
          {index === 0 ? <ShieldTileIcon tile={tile} className="h-4 w-auto" /> : index}
        </span>
        {label}
        {!open && (
          // Previews drop on short screens so the stage still fits.
          <span className="mt-0.5 block truncate font-normal text-brand-gray [@media(max-height:999px)]:hidden">
            {preview}
          </span>
        )}
      </button>

      <div
        className={`grid transition-all duration-500 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="max-w-lg overflow-hidden text-sm leading-relaxed text-foreground/80">
          <div className="pt-2.5">{children}</div>
        </div>
      </div>
    </li>
  );
}

/** Copies the page link (step 1 of the quick actions asks managers to share it). */
function ShareButton() {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (e.g. insecure intranet frame) — nothing to show.
    }
  };
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? t("managers.copied") : t("managers.share")}</span>
    </button>
  );
}
