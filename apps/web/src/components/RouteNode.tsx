import type { ReactNode } from "react";

/**
 * Single node on the route map.
 * nodeState: 'current' | 'selected' | 'future'
 */
export type RouteNodeState = "current" | "selected" | "future";

/** Visual family of the node: hotel role, core journey, or value-add diploma. */
export type RouteNodeTone = "role" | "core" | "advanced";

const TONE_CIRCLE: Record<RouteNodeTone, string> = {
  role: "border-2 border-primary/25 bg-primary/10 text-primary",
  core: "border-2 border-primary/30 bg-card text-primary",
  advanced: "border-2 border-orange-300 bg-orange-50 text-orange-600",
};

export default function RouteNode({
  label,
  nodeState,
  nodeId,
  onClick,
  stepNumber,
  isDestination,
  /** Slightly smaller label (e.g. journey step pills). */
  compactLabel = false,
  /** Fixed-size map tiles: fill parent, clamp label, show full text on hover. */
  uniformSquare = false,
  /** Small hint under label on map tiles (e.g. optional diploma). */
  mapBadge,
  /** Rich label for assistive tech; when set, native `title` is omitted on map tiles. */
  ariaLabel,
  /** Marker icon shown in the node disc (points-of-interest styling). */
  icon,
  tone,
}: {
  label: string;
  nodeState: RouteNodeState;
  nodeId: string;
  onClick: (nodeId: string) => void;
  stepNumber?: number | null;
  isDestination?: boolean;
  compactLabel?: boolean;
  uniformSquare?: boolean;
  mapBadge?: string | null;
  ariaLabel?: string | null;
  icon?: ReactNode;
  tone?: RouteNodeTone;
}) {
  const isCurrent = nodeState === "current";
  const isSelected = nodeState === "selected";

  const ringClass =
    isCurrent || isSelected
      ? "ring-2 ring-primary ring-offset-2"
      : tone
        ? ""
        : "border-2 border-border";
  const bgClass = isCurrent
    ? "bg-primary text-primary-foreground"
    : isSelected
      ? tone === "advanced"
        ? "bg-orange-600 text-white"
        : "bg-primary text-primary-foreground"
      : tone
        ? TONE_CIRCLE[tone]
        : "bg-muted text-foreground";

  const circleSize = icon ? "h-7 w-7" : isCurrent ? "h-6 w-6" : "h-5 w-5";
  const textColor = isCurrent ? "text-primary-foreground" : "text-foreground";
  const textSize = "text-[10px]";

  const labelClasses = uniformSquare
    ? `max-w-full min-h-[1lh] break-words px-0.5 text-center text-[10px] leading-tight line-clamp-4 ${
        isSelected ? "font-medium text-foreground" : "text-muted-foreground"
      }`
    : `max-w-full px-0.5 text-center ${
        compactLabel ? "text-[11px] leading-snug" : "text-xs"
      } ${isSelected ? "font-medium text-foreground" : "text-muted-foreground"}`;

  return (
    <button
      type="button"
      title={
        ariaLabel ? undefined : uniformSquare ? label : undefined
      }
      aria-label={ariaLabel ?? undefined}
      onClick={() => onClick(nodeId)}
      className={`flex flex-col items-center gap-1 rounded transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        uniformSquare
          ? "h-full min-h-0 w-full min-w-0 justify-center px-1 py-0.5"
          : "w-full"
      }`}
      aria-pressed={isSelected}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-full shadow-xs ${circleSize} ${bgClass} ${ringClass}`}
        aria-hidden
      >
        {icon ??
          (stepNumber != null && (
            <span className={`font-medium ${textColor} ${textSize}`}>
              {stepNumber}
            </span>
          ))}
      </div>
      <span className={labelClasses}>{label}</span>
      {mapBadge && (
        <span
          className={`shrink-0 text-center font-medium text-muted-foreground ${
            uniformSquare ? "line-clamp-1 text-[9px]" : "text-xs"
          }`}
        >
          {mapBadge}
        </span>
      )}
      {isDestination && (
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          Destination
        </span>
      )}
    </button>
  );
}
