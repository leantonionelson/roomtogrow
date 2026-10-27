import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/** Live result of a CSS media query. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** True when the user has asked the OS for reduced motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Clamp to 0–1. */
export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Ease-in-out cubic, for scroll-scrubbed transitions. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * Progress (0 → 1) of a tall scroll track past a sticky viewport: 0 when the
 * track's top reaches the top of the screen, 1 when its bottom reaches the
 * bottom. Drives the pinned "scrollytelling" sections.
 */
export function useStickyProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const next = travel > 0 ? clamp01(-rect.top / travel) : 0;
      setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return [ref, progress] as const;
}

/**
 * Whether the Navigator pins as a full screen: desktop width, tall enough to
 * hold its heading and a usable map, and motion allowed. Supporting your
 * team reads this too, to keep the gap between the two sections at 96px.
 */
export function useNavigatorPinned() {
  const fits = useMediaQuery("(min-width: 768px) and (min-height: 760px)");
  const reducedMotion = usePrefersReducedMotion();
  return fits && !reducedMotion;
}

/**
 * True while a sticky track spans the whole viewport, i.e. while its sticky
 * child is pinned.
 */
export function usePinned<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPinned(rect.top <= 1 && rect.bottom >= window.innerHeight - 1);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);

  return enabled && pinned;
}
