import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Play } from "lucide-react";
import { useSiteContent, useT } from "../content/ContentProvider";
import VideoDialog from "./VideoDialog";
import heroStill from "../assets/film/hero-still.jpg";

/** Interim campaign film — replace when the final asset is supplied. */
const CAMPAIGN_VIDEO_ID = "U1xXqaZ52Ms";

const rise = (ms: number) =>
  ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export default function HeroVideoSection() {
  const { strapline } = useSiteContent();
  const t = useT();
  const imgRef = useRef<HTMLImageElement>(null);

  // Cinematic parallax: the film still drifts slower than the page.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (imgRef.current) {
          imgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.12)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-[min(88vh,760px)] w-full items-center justify-center overflow-hidden py-20"
      aria-label="Hero"
    >
      {/* Still from the campaign film with a branded cinematic scrim. */}
      <img
        ref={imgRef}
        src={heroStill}
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.12] object-cover will-change-transform"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, rgba(31,68,86,0.88), rgba(31,68,86,0.55) 45%, rgba(16,28,35,0.92)), radial-gradient(50rem 26rem at 82% 96%, rgba(232,84,44,0.28), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-6 text-center md:py-8">
        <span
          className="glass-dark hero-rise rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/95 shadow-sm"
          style={rise(0)}
        >
          {t("hero.badge")}
        </span>

        <h1
          className="hero-rise mt-7 max-w-4xl text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl"
          style={rise(120)}
        >
          {strapline.headline}
        </h1>
        <p
          className="hero-rise mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/80 md:text-lg"
          style={rise(240)}
        >
          {strapline.intro}
        </p>

        <VideoDialog videoId={CAMPAIGN_VIDEO_ID} title={t("hero.watchFilm")}>
          <button
            type="button"
            className="hero-rise group mt-10 inline-flex h-12 items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-7 text-sm font-medium text-primary shadow-lg shadow-black/20 transition-colors hover:bg-white/90"
            style={rise(360)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
            </span>
            {t("hero.watchFilm")}
          </button>
        </VideoDialog>
      </div>

      <div
        className="hero-rise pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-white/60"
        style={rise(700)}
        aria-hidden
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>
    </section>
  );
}
