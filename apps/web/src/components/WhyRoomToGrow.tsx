import { useEffect } from "react";
import type { CSSProperties } from "react";
import { useSiteContent, useT } from "../content/ContentProvider";
import {
  clamp01,
  easeInOut,
  useMediaQuery,
  usePrefersReducedMotion,
  useStickyProgress,
} from "../lib/motion";
import Container from "./Container";
import { Reveal } from "./motion";
import lounge from "../assets/brand/portraits/lounge.jpg";
import reception from "../assets/brand/portraits/reception.jpg";
import meeting from "../assets/brand/portraits/meeting.jpg";
import bar from "../assets/brand/portraits/bar.jpg";
import housekeeping from "../assets/brand/portraits/housekeeping.jpg";

/** One portrait per selling point; `focus` keeps the face in a narrow crop. */
const PANELS = [
  { src: lounge, focus: "32% 40%" },
  { src: reception, focus: "38% 30%" },
  { src: meeting, focus: "42% 35%" },
  { src: bar, focus: "52% 30%" },
  { src: housekeeping, focus: "40% 35%" },
];

/** Track progress where the split starts and where the panels have opened. */
const SPLIT_START = 0.15;
const SPLIT_END = 0.75;
/** Pause (ms) after the last scroll event before snapping. */
const SNAP_IDLE_MS = 160;

/**
 * "Why Room to Grow": a single full-bleed photograph that, as you scroll,
 * splits into one portrait panel per selling point (after the adidas 2024
 * annual report). Pinned on desktop; a swipeable row of cards on phones and
 * a static grid when reduced motion is on.
 */
export default function WhyRoomToGrow() {
  const { sellingPoints } = useSiteContent();
  const t = useT();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = usePrefersReducedMotion();
  const [trackRef, progress] = useStickyProgress<HTMLDivElement>();

  const points = sellingPoints.slice(0, PANELS.length);
  const animated = isDesktop && !reducedMotion;

  // Snap: once the split has begun, a pause in scrolling carries it the rest
  // of the way to the opened panels (or back to the single photo when
  // scrolling up), so nobody has to scroll the whole unfold by hand.
  useEffect(() => {
    if (!animated) return;
    const el = trackRef.current;
    if (!el) return;
    let timer = 0;
    let lastY = window.scrollY;
    let direction = 0;
    const scrollFor = (p: number) =>
      el.getBoundingClientRect().top + window.scrollY + p * (el.offsetHeight - window.innerHeight);
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = Math.sign(y - lastY);
      lastY = y;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const travel = el.offsetHeight - window.innerHeight;
        const p = travel > 0 ? -el.getBoundingClientRect().top / travel : 0;
        if (p <= SPLIT_START + 0.02 || p >= SPLIT_END - 0.005) return;
        window.scrollTo({ top: scrollFor(direction < 0 ? 0 : SPLIT_END), behavior: "smooth" });
      }, SNAP_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [animated, trackRef]);

  return (
    <section className="pt-16 md:pt-24" aria-labelledby="why-heading">
      <Container>
        <Reveal>
          <h2 id="why-heading" className="text-2xl font-normal text-primary md:text-[2rem]">
            {t("selling.heading")}
          </h2>
          <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            {t("selling.subheading")}
          </p>
        </Reveal>
      </Container>

      {!isDesktop ? (
        <div
          className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-16 [scrollbar-width:none]"
          role="region"
          aria-label={t("selling.heading")}
          tabIndex={0}
        >
          {points.map((point, i) => (
            <article
              key={point.title}
              className="relative aspect-[3/4] w-[74vw] max-w-80 shrink-0 snap-start overflow-hidden"
            >
              <PanelImage panel={PANELS[i]} />
              <Caption title={point.title} body={point.body} visible />
            </article>
          ))}
        </div>
      ) : reducedMotion ? (
        <div className="mt-12 flex h-[80vh] max-h-[760px] pb-0">
          {points.map((point, i) => (
            <article key={point.title} className="group relative flex-1 overflow-hidden">
              <PanelImage panel={PANELS[i]} />
              <Caption title={point.title} body={point.body} visible />
            </article>
          ))}
        </div>
      ) : (
        <div ref={trackRef} className="relative mt-12 h-[280vh]">
          <SplitStage points={points} progress={progress} />
        </div>
      )}
    </section>
  );
}

function SplitStage({
  points,
  progress,
}: {
  points: { title: string; body?: string }[];
  progress: number;
}) {
  // Settle (slow zoom out) until SPLIT_START, split until SPLIT_END, then hold.
  const zoom = 1.08 - 0.08 * clamp01(progress / SPLIT_START);
  const split = easeInOut(clamp01((progress - SPLIT_START) / (SPLIT_END - SPLIT_START)));
  // How far the incoming panels have visibly opened: a panel's width over its
  // final width (flex-grow `split` beside the first panel's 1). Captions start
  // fading in at half open and are fully in once the panels hold.
  const n = points.length;
  const unfolded = n > 1 ? (n * split) / (1 + (n - 1) * split) : 1;
  const captions = clamp01((unfolded - 0.5) / 0.5);

  return (
    <div className="sticky top-0 flex h-screen overflow-hidden bg-brand-navy">
      {points.map((point, i) => (
        <article
          key={point.title}
          className="group relative min-w-0 overflow-hidden"
          style={{
            flexGrow: i === 0 ? 1 : split,
            flexBasis: 0,
            borderInlineStart: i === 0 ? undefined : `${2 * split}px solid white`,
          }}
          aria-hidden={i > 0 && split < 0.5 ? true : undefined}
        >
          <PanelImage
            panel={PANELS[i]}
            // The opening frame shows the whole scene; the face crop takes
            // over as the panel narrows.
            focus={i === 0 ? mixFocus("50% 45%", PANELS[0].focus, split) : undefined}
            style={{ transform: `scale(${zoom})` }}
          />
          <Caption title={point.title} body={point.body} visible={captions > 0} opacity={captions} />
        </article>
      ))}
    </div>
  );
}

function PanelImage({
  panel,
  focus,
  style,
}: {
  panel: (typeof PANELS)[number];
  focus?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={panel.src}
      alt=""
      // Not lazy: panels start 0px wide, so lazy loading would leave them
      // blank mid-split.
      className="absolute inset-0 h-full w-full object-cover will-change-transform"
      style={{ objectPosition: focus ?? panel.focus, ...style }}
    />
  );
}

function Caption({
  title,
  body,
  visible,
  opacity = 1,
}: {
  title: string;
  body?: string;
  visible: boolean;
  opacity?: number;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-6 pt-24 text-white lg:px-6 lg:pb-8"
      style={{ opacity, visibility: visible ? "visible" : "hidden" }}
    >
      <h3 className="max-w-[16rem] text-pretty font-heading text-base font-normal leading-snug [font-stretch:125%] lg:text-lg">
        {title}
      </h3>
      {body ? (
        <p className="mt-2 max-w-[20rem] text-pretty text-sm leading-relaxed text-white/90 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:group-hover:max-h-48 md:group-hover:opacity-100">
          {body}
        </p>
      ) : null}
    </div>
  );
}

/** Interpolate two "x% y%" object-positions. */
function mixFocus(from: string, to: string, t: number) {
  const a = from.split(" ").map(parseFloat);
  const b = to.split(" ").map(parseFloat);
  return `${a[0] + (b[0] - a[0]) * t}% ${a[1] + (b[1] - a[1]) * t}%`;
}
