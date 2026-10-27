import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { useT } from "../content/ContentProvider";
import { CAMPAIGN_VIDEO_ID } from "../lib/film";
import { ShieldLineArt } from "./brand/ShieldArt";

/** The slice of the YouTube IFrame Player API this component drives. */
interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

interface YouTubeNamespace {
  Player: new (
    el: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    },
  ) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const ENDED = 0;

let apiPromise: Promise<YouTubeNamespace> | null = null;

/** Loads the IFrame API once; rejects if it hasn't arrived after `ms`. */
function loadYouTubeApi(ms = 8000): Promise<YouTubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        apiPromise = null;
        reject(new Error("YouTube API timed out"));
      }, ms);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        window.clearTimeout(timer);
        if (window.YT) resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => {
        window.clearTimeout(timer);
        apiPromise = null;
        reject(new Error("YouTube API failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Full-screen film takeover (after bravepeople.co): navy stage, shield line
 * art, the film centred without YouTube chrome, and a thin scrubber with a
 * dot. If the player API can't load (e.g. blocked on the intranet) it falls
 * back to the standard embed with YouTube's own controls.
 */
export default function FilmTakeover({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-brand-navy text-white outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-500"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
          {open && <FilmStage title={title} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function FilmStage({ title }: { title: string }) {
  const t = useT();
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [fallback, setFallback] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        // The API swaps its target for an iframe, so give it a node React
        // doesn't own.
        const target = document.createElement("div");
        mountRef.current.appendChild(target);
        playerRef.current = new YT.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: CAMPAIGN_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            cc_load_policy: 1,
            disablekb: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: () => {
              setDuration(playerRef.current?.getDuration() ?? 0);
              playerRef.current?.playVideo();
            },
            onStateChange: (e) => setPlaying(e.data === PLAYING),
          },
        });
      })
      .catch(() => !cancelled && setFallback(true));
    const mount = mountRef.current;
    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      mount?.replaceChildren();
    };
  }, []);

  // Poll the playhead while playing (the API has no timeupdate event).
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setTime(p.getCurrentTime());
      if (!duration) setDuration(p.getDuration());
      if (p.getPlayerState() === ENDED) setPlaying(false);
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, duration]);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) p.unMute();
    else p.mute();
    setMuted(!muted);
  };

  const seek = useCallback(
    (seconds: number) => {
      const p = playerRef.current;
      if (!p || !duration) return;
      const clamped = Math.min(duration, Math.max(0, seconds));
      p.seekTo(clamped, true);
      setTime(clamped);
    },
    [duration],
  );

  const scrubFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const x = rtl ? rect.right - e.clientX : e.clientX - rect.left;
    seek((x / rect.width) * duration);
  };

  const onScrubKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[
      e.key as "ArrowRight"
    ];
    if (step) {
      e.preventDefault();
      seek(time + step);
    } else if (e.key === "Home") seek(0);
    else if (e.key === "End") seek(duration);
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const controlClass =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <>
      <ShieldLineArt className="pointer-events-none absolute -left-[6%] top-1/2 w-[30vw] max-w-[420px] -translate-y-[58%] opacity-90 max-md:hidden" />

      <DialogPrimitive.Close
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy md:right-6 md:top-6"
        aria-label={t("film.close")}
      >
        <X className="h-5 w-5" aria-hidden />
      </DialogPrimitive.Close>

      <div className="flex flex-1 items-center justify-center px-4 pb-4 pt-16 md:px-[12%]">
        <div className="relative aspect-video w-full max-w-[calc((100dvh-11rem)*16/9)] overflow-hidden bg-black shadow-2xl shadow-black/40 animate-in zoom-in-95 duration-700">
          {fallback ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${CAMPAIGN_VIDEO_ID}?autoplay=1&rel=0&cc_load_policy=1`}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <div ref={mountRef} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
              {/* Click-to-pause surface (the chrome-less player has no UI). */}
              <button
                type="button"
                onClick={togglePlay}
                tabIndex={-1}
                aria-hidden
                className="absolute inset-0 cursor-pointer"
              />
            </>
          )}
        </div>
      </div>

      {!fallback && (
        <div className="relative z-10 flex items-center gap-3 px-4 pb-6 md:gap-4 md:px-[2.5%] md:pb-10">
          <button
            type="button"
            onClick={togglePlay}
            className={controlClass}
            aria-label={playing ? t("film.pause") : t("film.play")}
          >
            {playing ? (
              <Pause className="h-4 w-4 fill-current" aria-hidden />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
            )}
          </button>

          <div
            role="slider"
            tabIndex={0}
            aria-label={t("film.progress")}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              scrubFromPointer(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) scrubFromPointer(e);
            }}
            onKeyDown={onScrubKey}
            className="group relative h-8 flex-1 cursor-pointer touch-none focus-visible:outline-none"
          >
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/45" />
            <span
              className="absolute start-0 top-1/2 h-px -translate-y-1/2 bg-white"
              style={{ width: `${pct}%` }}
            />
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform group-hover:scale-125 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-brand-navy rtl:translate-x-1/2"
              style={{ insetInlineStart: `${pct}%` }}
            />
          </div>

          <span className="w-20 text-end text-xs tabular-nums text-white/70">
            {formatTime(time)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={toggleMute}
            className={controlClass}
            aria-label={muted ? t("film.unmute") : t("film.mute")}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" aria-hidden />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      )}
    </>
  );
}
