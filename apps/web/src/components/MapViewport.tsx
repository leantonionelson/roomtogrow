import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { useT } from "../content/ContentProvider";

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
/** How far (px) the content may be dragged past its edge. */
const OVERPAN = 80;
/** Pointer travel (px) before a gesture counts as a drag, not a click. */
const DRAG_THRESHOLD = 6;

interface ViewState {
  x: number;
  y: number;
  scale: number;
}

/**
 * Google-Maps-style viewport: drag to pan, Ctrl/⌘ + scroll to zoom around the
 * cursor (plain scrolling keeps moving the page), plus explicit zoom controls
 * and a return-to-centre control. Children keep their natural layout size;
 * the transform only affects paint, so the viewport's height stays stable
 * while zoomed content clips.
 */
export default function MapViewport({
  children,
  /** CSS selector for the element to centre on (e.g. the current role tile). */
  focusSelector,
  /**
   * Static canvas ground rendered behind the map. It sits outside the
   * transformed layer, so it stays put while the map pans and zooms over it.
   */
  background,
}: {
  children: ReactNode;
  focusSelector?: string;
  background?: ReactNode;
}) {
  const t = useT();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const clampView = useCallback((next: ViewState): ViewState => {
    const vp = viewportRef.current;
    const ct = contentRef.current;
    if (!vp || !ct) return next;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    const cw = ct.offsetWidth * next.scale;
    const ch = ct.offsetHeight * next.scale;
    const minX = Math.min(vw - cw, 0) - OVERPAN;
    const maxX = Math.max(vw - cw, 0) + OVERPAN;
    const minY = Math.min(vh - ch, 0) - OVERPAN;
    const maxY = Math.max(vh - ch, 0) + OVERPAN;
    return {
      x: Math.min(Math.max(next.x, minX), maxX),
      y: Math.min(Math.max(next.y, minY), maxY),
      scale: next.scale,
    };
  }, []);

  /** Zoom by `factor`, keeping the viewport point (px, py) stationary. */
  const zoomBy = useCallback(
    (factor: number, px?: number, py?: number) => {
      setView((v) => {
        const vp = viewportRef.current;
        const cx = px ?? (vp ? vp.clientWidth / 2 : 0);
        const cy = py ?? (vp ? vp.clientHeight / 2 : 0);
        const scale = Math.min(Math.max(v.scale * factor, MIN_SCALE), MAX_SCALE);
        const k = scale / v.scale;
        return clampView({
          x: cx - (cx - v.x) * k,
          y: cy - (cy - v.y) * k,
          scale,
        });
      });
    },
    [clampView],
  );

  /**
   * Return to centre: with a focus element (the "you are here" tile), centre
   * it at the current zoom; otherwise recentre the whole map at default zoom.
   */
  const returnToCentre = useCallback(() => {
    const vp = viewportRef.current;
    const ct = contentRef.current;
    if (!vp || !ct) return;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    setView((v) => {
      const focusEl = focusSelector
        ? ct.querySelector<HTMLElement>(focusSelector)
        : null;
      if (focusEl) {
        const cr = ct.getBoundingClientRect();
        const fr = focusEl.getBoundingClientRect();
        const scaleNow = ct.offsetWidth ? cr.width / ct.offsetWidth : 1;
        const fx = (fr.left - cr.left + fr.width / 2) / scaleNow;
        const fy = (fr.top - cr.top + fr.height / 2) / scaleNow;
        return clampView({
          x: vw / 2 - fx * v.scale,
          y: vh / 2 - fy * v.scale,
          scale: v.scale,
        });
      }
      return clampView({
        x: (vw - ct.offsetWidth) / 2,
        y: (vh - ct.offsetHeight) / 2,
        scale: 1,
      });
    });
  }, [clampView, focusSelector]);

  // Native listener: wheel needs preventDefault, so it can't be passive.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoomBy(Math.exp(-e.deltaY * 0.002), e.clientX - rect.left, e.clientY - rect.top);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || dragRef.current) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originX: view.x,
      originY: view.y,
      moved: false,
    };
    // Deliberately NOT capturing the pointer yet: capture retargets the
    // eventual click to this container, which would swallow tile taps.
    // Capture starts only once movement crosses the drag threshold.
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
      drag.moved = true;
      setDragging(true);
      try {
        viewportRef.current?.setPointerCapture(e.pointerId);
      } catch {
        // Pointer may already be gone (e.g. released mid-frame); the drag
        // still works, it just won't track outside the viewport.
      }
    }
    if (!drag.moved) return;
    setView((v) =>
      clampView({ x: drag.originX + dx, y: drag.originY + dy, scale: v.scale }),
    );
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || e.pointerId !== drag.pointerId) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    setDragging(false);
  };

  /** Un-captured press that wanders out of the viewport: abandon it. */
  const onPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (drag && !drag.moved && e.pointerId === drag.pointerId) {
      dragRef.current = null;
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const controlClass =
    "flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-foreground shadow-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="relative h-full min-h-0">
      <div
        ref={viewportRef}
        className="touch-pan-y relative h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
      >
        {background}
        <div
          ref={contentRef}
          className={`h-full origin-top-left will-change-transform ${
            dragging ? "" : "transition-transform duration-300 ease-out"
          }`}
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          {children}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-[5] flex flex-col gap-1.5">
        <button type="button" aria-label={t("map.zoomIn")} className={controlClass} onClick={() => zoomBy(1.25)}>
          <Plus className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" aria-label={t("map.zoomOut")} className={controlClass} onClick={() => zoomBy(0.8)}>
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t("map.reset")}
          title={t("map.reset")}
          className={controlClass}
          onClick={returnToCentre}
        >
          <LocateFixed className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 z-[5] hidden rounded-full border bg-background/85 px-2.5 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur sm:block">
        {t("map.hint")}
      </span>
    </div>
  );
}
