/**
 * Single node on the route map.
 * nodeState: 'current' | 'selected' | 'future'
 */
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
}) {
  const isCurrent = nodeState === "current";
  const isSelected = nodeState === "selected";

  const ringClass =
    isCurrent || isSelected
      ? "ring-2 ring-gray-800 ring-offset-2"
      : "border-2 border-gray-400";
  const bgClass =
    isCurrent
      ? "bg-gray-800"
      : isSelected
        ? "bg-gray-600"
        : "bg-gray-200";

  const circleSize = isCurrent ? "h-6 w-6" : "h-5 w-5";
  const textColor = isCurrent ? "text-white" : "text-gray-800";
  const textSize = "text-[10px]";

  const labelClasses = uniformSquare
    ? `max-w-full break-words px-0.5 text-center text-[10px] leading-tight line-clamp-4 ${
        isSelected ? "font-medium text-gray-800" : "text-gray-700"
      }`
    : `max-w-full px-0.5 text-center ${
        compactLabel ? "text-[11px] leading-snug" : "text-xs"
      } ${isSelected ? "font-medium text-gray-800" : "text-gray-700"}`;

  return (
    <button
      type="button"
      title={
        ariaLabel ? undefined : uniformSquare ? label : undefined
      }
      aria-label={ariaLabel ?? undefined}
      onClick={() => onClick(nodeId)}
      className={`flex flex-col items-center gap-1 transition-all hover:opacity-90 hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded ${
        uniformSquare
          ? "h-full min-h-0 w-full min-w-0 justify-center px-1 py-0.5"
          : "w-full"
      }`}
      aria-pressed={isSelected}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-full ${circleSize} ${bgClass} ${ringClass}`}
        aria-hidden
      >
        {stepNumber != null && (
          <span className={`font-medium ${textColor} ${textSize}`}>
            {stepNumber}
          </span>
        )}
      </div>
      <span className={labelClasses}>{label}</span>
      {mapBadge && (
        <span
          className={`shrink-0 text-center font-medium text-blue-800/90 ${
            uniformSquare ? "line-clamp-1 text-[9px]" : "text-xs"
          }`}
        >
          {mapBadge}
        </span>
      )}
      {isDestination && (
        <span className="shrink-0 text-xs font-medium text-gray-600">Destination</span>
      )}
    </button>
  );
}
