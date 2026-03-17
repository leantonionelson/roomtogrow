/**
 * Single node on the route map.
 * nodeState: 'current' | 'selected' | 'future'
 */
export default function RouteNode({
  type,
  label,
  nodeState,
  nodeId,
  onClick,
  isFirstRole,
  stepNumber,
  isDestination,
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

  return (
    <button
      type="button"
      onClick={() => onClick(nodeId)}
      className="flex flex-col items-center gap-1 transition-all hover:opacity-90 hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
      aria-pressed={isSelected}
    >
      <div
        className={`flex items-center justify-center rounded-full ${circleSize} ${bgClass} ${ringClass}`}
        aria-hidden
      >
        {stepNumber != null && (
          <span className={`font-medium ${textColor} ${textSize}`}>
            {stepNumber}
          </span>
        )}
      </div>
      <span
        className={`max-w-[120px] text-center text-xs ${
          isSelected ? "font-medium text-gray-800" : "text-gray-700"
        }`}
      >
        {label}
      </span>
      {isFirstRole && isCurrent && (
        <span className="text-xs font-medium text-gray-800">You are here</span>
      )}
      {isDestination && (
        <span className="text-xs font-medium text-gray-600">Destination</span>
      )}
    </button>
  );
}
