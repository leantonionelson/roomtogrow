import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  LayoutGrid,
  Route,
  UsersRound,
} from "lucide-react";
import { useSiteContent, useT } from "../content/ContentProvider";
import { Reveal } from "./motion";
import film1 from "../assets/film/film-1.jpg";
import film2 from "../assets/film/film-2.jpg";
import film3 from "../assets/film/film-3.jpg";

/** Matches the `gap-5` between cards. */
const CARD_GAP = 20;

/** Cycled per card; purely decorative until brand imagery arrives. */
const POINT_ICONS = [Route, UsersRound, Clock3, GraduationCap, LayoutGrid];
/** Stills from the campaign film — interim imagery until brand assets land. */
const POINT_IMAGES = [film1, film2, film3];

export default function SellingPointsGrid() {
  const { sellingPoints } = useSiteContent();
  const t = useT();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const step = (card?.offsetWidth ?? 320) + CARD_GAP;
    // scrollLeft runs negative in RTL, so flip the direction there.
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({
      left: step * (dir === "next" ? 1 : -1) * (rtl ? -1 : 1),
      behavior: "smooth",
    });
  };

  const navButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section className="py-20 md:py-28" aria-labelledby="selling-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h2
              id="selling-heading"
              className="text-gradient-brand text-3xl font-semibold tracking-tight md:text-4xl"
            >
              {t("selling.heading")}
            </h2>
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("selling.subheading")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scroll("prev")}
                aria-label={t("selling.prev")}
                className={navButtonClass}
              >
                <ChevronLeft className="h-4.5 w-4.5 rtl:rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scroll("next")}
                aria-label={t("selling.next")}
                className={navButtonClass}
              >
                <ChevronRight className="h-4.5 w-4.5 rtl:rotate-180" aria-hidden />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Track breaks out of the container and runs off-canvas to the right. */}
      <div
        ref={scrollerRef}
        id="selling-points-carousel"
        role="region"
        aria-label={t("selling.heading")}
        tabIndex={0}
        /* overflow-y is pinned hidden: setting overflow-x alone promotes it to
           `auto`, which lets the reveal/hover transforms create a stray
           vertical scroll. Padding leaves room for the hover lift + shadow. */
        className="carousel-bleed mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-8 pt-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sellingPoints.map((point, i) => {
          const Icon = POINT_ICONS[i % POINT_ICONS.length];
          const image = POINT_IMAGES[i % POINT_IMAGES.length];
          return (
            <Reveal
              key={point}
              delay={i * 90}
              className="w-[290px] flex-shrink-0 snap-start sm:w-[340px] lg:w-[380px]"
            >
              <article
                data-carousel-card
                className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="relative h-52 w-full overflow-hidden lg:h-60">
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    aria-hidden
                    style={{
                      background:
                        "linear-gradient(to top, rgba(31,68,86,0.62), rgba(31,68,86,0.05) 60%)",
                    }}
                  />
                  <span className="glass absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full text-foreground shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="absolute right-4 top-4 text-xs font-semibold tabular-nums text-white/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <p className="text-pretty text-lg font-medium leading-snug tracking-tight text-foreground">
                    {point}
                  </p>
                  <span
                    className="h-1 w-10 rounded-full bg-primary/25 transition-all duration-300 group-hover:w-16 group-hover:bg-primary"
                    aria-hidden
                  />
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
