import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Pause, Play, Video } from "lucide-react";
import { useSiteContent, useT } from "../content/ContentProvider";
import { usePrefersReducedMotion } from "../lib/motion";
import { CAMPAIGN_VIDEO_ID } from "../lib/film";
import FilmTakeover from "./FilmTakeover";
import IhgUniversityLogo from "./brand/IhgUniversityLogo";
import { ShieldLineArt } from "./brand/ShieldArt";
import heroStill from "../assets/brand/hero.jpg";

const rise = (ms: number) =>
  ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

/** Muted, chrome-less background loop of the campaign film. */
const BACKGROUND_SRC =
  `https://www.youtube-nocookie.com/embed/${CAMPAIGN_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${CAMPAIGN_VIDEO_ID}&controls=0` +
  "&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&enablejsapi=1";

/** Each sentence of the strapline gets its own line, as in the design. */
function splitSentences(text: string) {
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()) ?? [text];
}

/**
 * Hero: brand photography with the film playing muted over it (the still
 * stays underneath as the poster and as the fallback when YouTube is blocked
 * or reduced motion is on), shield line art, and the "Watch the film" pill
 * that opens the full-screen takeover.
 */
export default function HeroVideoSection() {
  const { strapline } = useSiteContent();
  const t = useT();
  const reducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);

  const command = (func: "playVideo" | "pauseVideo") =>
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*",
    );

  const togglePaused = () => {
    command(paused ? "playVideo" : "pauseVideo");
    setPaused(!paused);
  };

  const openFilm = () => {
    command("pauseVideo");
    setFilmOpen(true);
  };

  const closeFilm = () => {
    setFilmOpen(false);
    if (!paused) command("playVideo");
  };

  // Reveal the loop only once the player reports it is actually playing, so
  // a blocked autoplay (or a blocked YouTube) leaves the still in place
  // rather than YouTube's poster and play button.
  useEffect(() => {
    if (reducedMotion) return;
    let timer = 0;
    const onMessage = (e: MessageEvent) => {
      if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin)) return;
      if (e.source !== frameRef.current?.contentWindow) return;
      let data: { event?: string; info?: number | { playerState?: number } };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const state =
        typeof data.info === "number" ? data.info : data.info?.playerState;
      if (state === 1 && !timer) {
        // Give YouTube's title overlay a moment to fade first.
        timer = window.setTimeout(() => setVideoReady(true), 1500);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  /** Subscribe to player events (the iframe API handshake). */
  const listen = () =>
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: "hero-loop", channel: "widget" }),
      "*",
    );

  const lines = splitSentences(strapline.headline);

  return (
    <section
      className="relative isolate overflow-hidden bg-brand-navy pb-14 pt-20 text-white md:pb-16 md:pt-24"
      aria-label={t("a11y.hero")}
    >
      <div className="grid md:min-h-[min(78vh,680px)] md:grid-cols-[minmax(0,44%)_minmax(0,1fr)]">
        {/* Media panel — flush to the viewport edge. The line art sits outside
            its clip so it can overhang the photo's lower edge, as designed. */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
            <img
              src={heroStill}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
            />
            {!reducedMotion && (
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 [container-type:size] ${
                  videoReady ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
              >
                <iframe
                  ref={frameRef}
                  src={BACKGROUND_SRC}
                  title=""
                  tabIndex={-1}
                  allow="autoplay; encrypted-media"
                  onLoad={listen}
                  className="absolute left-1/2 top-1/2 h-[max(130cqh,73.13cqw)] w-[max(130cqw,231.11cqh)] -translate-x-1/2 -translate-y-1/2 border-0"
                />
              </div>
            )}
            {!reducedMotion && videoReady && (
              <button
                type="button"
                onClick={togglePaused}
                aria-label={paused ? t("hero.playBackground") : t("hero.pauseBackground")}
                className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {paused ? (
                  <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden />
                ) : (
                  <Pause className="h-3.5 w-3.5 fill-current" aria-hidden />
                )}
              </button>
            )}
          </div>
          <ShieldLineArt className="pointer-events-none absolute -left-[9%] top-[22%] z-10 w-[44%] max-w-[400px] md:top-[24%] md:w-[62%]" />
        </div>

        <div className="flex flex-col px-5 pt-10 sm:px-8 md:px-10 md:pt-0 lg:px-14">
          <div className="hero-rise" style={rise(0)}>
            <IhgUniversityLogo className="h-6 w-auto md:h-7" />
          </div>

          <div className="flex flex-1 flex-col justify-center py-8 md:py-10">
            <h1
              className="hero-rise max-w-2xl text-balance text-[2rem] font-light leading-[1.12] md:text-[2.6rem] lg:text-5xl"
              style={rise(120)}
            >
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p
              className="hero-rise mt-6 max-w-lg text-pretty text-sm leading-relaxed text-white/85 md:text-base"
              style={rise(240)}
            >
              {strapline.intro}
            </p>

            <div className="hero-rise mt-9" style={rise(360)}>
              <WatchFilmButton label={t("hero.watchFilm")} onClick={openFilm} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="hero-rise pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-white/70"
        style={rise(700)}
        aria-hidden
      >
        <ChevronDown className="h-6 w-6 stroke-1" />
      </div>

      <FilmTakeover open={filmOpen} onClose={closeFilm} title={t("hero.watchFilm")} />
    </section>
  );
}

/**
 * Outlined pill. Rollover swaps the label for a drifting row of camera
 * glyphs; pressing fills it Signature Orange (design states: inactive /
 * rollover / click).
 */
function WatchFilmButton({ label, onClick }: { label: string; onClick: () => void }) {
  const cameras = Array.from({ length: 12 });
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-flex h-11 w-48 items-center justify-center overflow-hidden rounded-full border border-white/90 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy active:border-brand-orange active:bg-brand-orange"
    >
      <span className="relative z-10 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-100 group-active:opacity-100">
        {label}
      </span>
      <span
        className="pointer-events-none absolute inset-0 flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-0 group-active:opacity-0"
        aria-hidden
      >
        <span className="film-marquee flex shrink-0 gap-3 pl-3">
          {cameras.map((_, i) => (
            <Video key={i} className="h-4 w-4 shrink-0 fill-current" />
          ))}
        </span>
      </span>
    </button>
  );
}
