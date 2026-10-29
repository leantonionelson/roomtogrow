import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Pause, Play, X } from "lucide-react";
import { useT } from "../content/ContentProvider";
import { FILM_SRC } from "../lib/film";
import { ShieldLineArt } from "./brand/ShieldArt";

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Full-screen film takeover (after bravepeople.co): navy stage, shield line
 * art, the film centred without browser chrome, and a thin scrubber with a
 * dot. The film has no soundtrack, so there's no mute control.
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const seek = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video || !duration) return;
      const clamped = Math.min(duration, Math.max(0, seconds));
      video.currentTime = clamped;
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
          <video
            ref={videoRef}
            src={FILM_SRC}
            title={title}
            autoPlay
            playsInline
            preload="auto"
            onClick={togglePlay}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            className="h-full w-full cursor-pointer object-contain"
          />
        </div>
      </div>

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
      </div>
    </>
  );
}
