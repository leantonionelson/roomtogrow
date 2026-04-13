import { useCallback, useLayoutEffect, useRef, useState } from "react";
import RouteNode from "./RouteNode";
import { MAP_CONNECTORS } from "../data/mapTopology";
import {
  getPastRoleIds,
  getProgrammeById,
  getRoleById,
  MAP_MODE,
  overviewLead,
  programmeRelevanceLine,
  programmes,
  roles,
} from "../data/contentModel";

/**
 * Pyramid on a 9-column grid (IHG-style):
 * — Top: 3 diplomas / value-add (cols 3, 5, 7)
 * — Middle: 4 journey steps (cols 2, 4, 6, 8)
 * — Bottom: 5 hotel roles (cols 1, 3, 5, 7, 9)
 */
/** `minmax(0,1fr)` lets columns shrink so tiles + gaps fit the container width. */
const PYRAMID_GRID =
  "grid min-w-0 w-full grid-cols-[repeat(9,minmax(0,1fr))] gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 xl:gap-x-6";

const DIPLOMA_PLACEMENT = [
  { id: "hospitality_diploma_3", col: 3 },
  { id: "hospitality_diploma_4", col: 5 },
  { id: "hospitality_diploma_5", col: 7 },
];
const JOURNEY_PLACEMENT = [
  { id: "journey_supervisor", col: 2 },
  { id: "journey_manager", col: 4 },
  { id: "journey_senior_manager", col: 6 },
  { id: "journey_gm", col: 8 },
];
const ROLE_PLACEMENT = [
  { id: "frontline", col: 1 },
  { id: "supervisor", col: 3 },
  { id: "manager", col: 5 },
  { id: "senior_manager", col: 7 },
  { id: "general_manager", col: 9 },
];

function getNodeSpec(nodeId) {
  const r = roles.find((x) => x.id === nodeId);
  if (r) return { nodeType: "role", label: r.label, id: r.id };
  const p = programmes.find((x) => x.id === nodeId);
  if (p) return { nodeType: "programme", label: p.title, id: p.id };
  return null;
}

/** Summary line + CTA label for map tiles (tooltips + aria). */
function getMapTileCopy(nodeId) {
  const roleEntity = getRoleById(nodeId);
  if (roleEntity) {
    const summaryLine =
      roleEntity.id === "general_manager"
        ? "Leadership at this level shows in how you grow your team and the business day to day."
        : overviewLead(roleEntity.overview);
    return { summaryLine, ctaLabel: "See options" };
  }
  const progEntity = getProgrammeById(nodeId);
  if (progEntity) {
    return {
      summaryLine: programmeRelevanceLine(progEntity),
      ctaLabel:
        progEntity.type === "advanced" ? "Discuss with manager" : "Start now",
    };
  }
  return { summaryLine: "", ctaLabel: "" };
}

function PyramidSlot({ colStart, children, align = "center" }) {
  const alignClass =
    align === "end"
      ? "items-end justify-center"
      : align === "start"
        ? "items-start justify-center"
        : "items-center justify-center";
  return (
    <div
      className={`col-span-1 flex min-h-0 min-w-0 w-full ${alignClass}`}
      style={{ gridColumnStart: colStart }}
    >
      {children}
    </div>
  );
}

export default function MapCanvas({
  userContext,
  highlightedNodeIds = [],
  highlightedConnectionIds = [],
  activeConnectionIds = [],
  softConnectionIdsForCommit = [],
  mapInteractionState = "idle",
  selectedNodeId,
  selectedProgrammeId,
  onSelectMapNode,
  openDrawer,
  selectedPersonaId,
  onSelectPersona,
  PersonaQualifierComponent,
  aiFocus,
}) {
  const isMapActive = userContext != null;
  const mapMode = userContext?.mapMode ?? MAP_MODE.startNow;
  const isExploreNext = mapMode === MAP_MODE.exploreNext;
  const pastRoleIds = userContext?.currentRoleId
    ? new Set(getPastRoleIds(userContext.currentRoleId))
    : new Set();

  const aiFocusNodeIds = new Set(aiFocus?.nodeIds ?? []);
  const aiFocusConnectorIds = new Set(aiFocus?.connectorIds ?? []);
  const hasAiFocus = aiFocusNodeIds.size > 0 || aiFocusConnectorIds.size > 0;

  const activeConnSet = new Set(activeConnectionIds);
  const suggestConnSet = new Set(highlightedConnectionIds);
  const softCommitConnSet = new Set(softConnectionIdsForCommit);
  const highlightedNodeSet = new Set(highlightedNodeIds);

  const mapRef = useRef(null);
  const [anchors, setAnchors] = useState({});

  const measureAnchors = useCallback(() => {
    const root = mapRef.current;
    if (!root) return;
    const mapRect = root.getBoundingClientRect();
    const next = {};
    root.querySelectorAll("[data-map-node]").forEach((el) => {
      const id = el.getAttribute("data-map-node");
      if (!id) return;
      const r = el.getBoundingClientRect();
      next[id] = {
        x: r.left - mapRect.left + r.width / 2,
        y: r.top - mapRect.top + r.height / 2,
      };
    });
    setAnchors(next);
  }, []);

  useLayoutEffect(() => {
    measureAnchors();
    const root = mapRef.current;
    if (!root) return undefined;
    const ro = new ResizeObserver(() => measureAnchors());
    ro.observe(root);
    window.addEventListener("resize", measureAnchors);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureAnchors);
    };
  }, [
    measureAnchors,
    isMapActive,
    selectedNodeId,
    selectedProgrammeId,
    userContext?.currentRoleId,
    mapMode,
    mapInteractionState,
    highlightedConnectionIds,
    activeConnectionIds,
  ]);

  const renderMapNode = (nodeId) => {
    const spec = getNodeSpec(nodeId);
    if (!spec) return null;

    const isSelected =
      selectedNodeId === nodeId || selectedProgrammeId === nodeId;
    const isRelevant = highlightedNodeSet.has(nodeId);
    const isCurrentRole = userContext?.currentRoleId === nodeId;
    const isDiplomaNode = nodeId.startsWith("hospitality_diploma");
    const isAiFocusNode = aiFocusNodeIds.has(nodeId);
    const isSoftDiplomaSuggest =
      mapInteractionState === "role_selected" &&
      isDiplomaNode &&
      highlightedNodeSet.has(nodeId);
    const isPastRole =
      spec.nodeType === "role" && pastRoleIds.has(nodeId) && isExploreNext;
    const isJourneyNode = nodeId.startsWith("journey_");

    let nodeState = "future";
    if (isSelected) nodeState = "selected";
    else if (isCurrentRole) nodeState = "current";

    const hasGuidedHighlights =
      isMapActive &&
      (mapInteractionState === "role_selected" ||
        mapInteractionState === "node_selected") &&
      highlightedNodeIds.length > 0;

    let nodeOpacity = !isMapActive
      ? "opacity-100"
      : !hasGuidedHighlights || isRelevant || isSelected
        ? "opacity-100"
        : "opacity-[0.28]";
    if (isMapActive && isPastRole) {
      nodeOpacity = "opacity-25";
    }
    if (hasAiFocus && isAiFocusNode) {
      nodeOpacity = "opacity-100";
    }
    if (isSoftDiplomaSuggest && !isSelected) {
      nodeOpacity = "opacity-90";
    }

    const cardRing =
      isSelected || isAiFocusNode
        ? "ring-2 ring-gray-700 shadow-md"
        : isSoftDiplomaSuggest
          ? "ring-1 ring-gray-400 border border-dashed border-gray-400"
          : "border-gray-300";
    const cardPulse = isAiFocusNode && !isDiplomaNode ? "animate-pulse" : "";

    const optionalMapBadge = isSoftDiplomaSuggest ? "Optional" : undefined;
    const { summaryLine, ctaLabel } = getMapTileCopy(nodeId);
    const ariaLabel = [spec.label, summaryLine, ctaLabel].filter(Boolean).join(". ");

    return (
      <div
        key={nodeId}
        data-map-node={nodeId}
        className={`relative flex w-full min-w-0 flex-col items-stretch transition-all duration-300 ${nodeOpacity} ${isSelected ? "z-10" : "z-0"}`}
      >
        {isCurrentRole && isMapActive && (
          <div
            className="pointer-events-none absolute -top-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-sm sm:text-[10px]"
            aria-hidden
          >
            You are here
          </div>
        )}
        <div
          className={`group relative flex aspect-square w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white/90 shadow-sm transition-all hover:scale-105 ${cardRing} ${cardPulse}`}
        >
          {summaryLine ? (
            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden w-[min(12rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-2 text-left shadow-md opacity-0 transition-opacity duration-150 sm:block sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              aria-hidden
            >
              <p className="text-xs font-semibold text-gray-900">{spec.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-600">
                {summaryLine}
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-blue-900">
                {ctaLabel}
              </p>
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-2">
            <RouteNode
              type={spec.nodeType}
              label={spec.label}
              nodeId={spec.id}
              nodeState={nodeState}
              compactLabel={isJourneyNode}
              uniformSquare
              mapBadge={optionalMapBadge}
              ariaLabel={ariaLabel}
              onClick={(id) => {
                onSelectMapNode?.(id);
                openDrawer?.();
              }}
            />
          </div>
          {isSelected && summaryLine ? (
            <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-1 py-1.5 text-center sm:hidden">
              <p className="line-clamp-2 text-[9px] font-semibold text-gray-900">
                {spec.label}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[8px] leading-tight text-gray-600">
                {summaryLine}
              </p>
              <p className="mt-0.5 text-[8px] font-medium text-blue-900">
                {ctaLabel}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col bg-gray-100">
      <div className="relative flex w-full min-w-0 flex-col overflow-x-hidden overflow-y-visible bg-gray-100">
        {!isMapActive && !selectedPersonaId && PersonaQualifierComponent && (
          <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center p-6">
            <div className="w-full max-w-md rounded-xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
              <PersonaQualifierComponent
                selectedPersonaId={selectedPersonaId}
                onSelectPersona={onSelectPersona}
              />
            </div>
          </div>
        )}

        <div
          className="relative mx-auto flex w-full min-w-0 max-w-[1920px] flex-col px-3 py-6 transition-opacity duration-500 sm:px-6 md:py-7 lg:px-12 lg:py-8"
          style={{ opacity: !isMapActive && !selectedPersonaId ? 0.3 : 1 }}
        >
          {/* Left axis: band titles (pyramid tiers), low contrast */}
          <div
            className="pointer-events-none absolute bottom-28 left-3 top-10 z-[3] flex w-[6.5rem] flex-col justify-between text-[10px] leading-snug text-gray-500 sm:left-5 sm:w-36 sm:text-[11px] md:bottom-32 md:w-40 md:text-xs md:py-2"
            aria-hidden
          >
            <span className="max-w-[6.5rem] sm:max-w-none">
              Value add learning / Applied leadership
            </span>
            <span className="max-w-[6.5rem] sm:max-w-none">
              Core learning / Transitional leadership
            </span>
            <span className="max-w-[6.5rem] sm:max-w-none">Hotel role</span>
          </div>

          {/* Ref on padded content so anchor math matches SVG (same coordinate origin). */}
          <div
            ref={mapRef}
            className="relative flex min-w-0 flex-col pl-12 sm:pl-16 md:pl-20 lg:pl-28"
          >
          <svg className="pointer-events-none absolute inset-0 z-[1] h-full min-h-full w-full overflow-visible">
            <defs>
              <marker
                id="arrowhead-relevant"
                markerWidth="8"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#6b7280" opacity="0.8" />
              </marker>
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#1d4ed8" opacity="0.9" />
              </marker>
            </defs>
            {MAP_CONNECTORS.map(({ id, fromId, toId, type }) => {
              const p1 = anchors[fromId];
              const p2 = anchors[toId];
              if (!p1 || !p2) return null;

              const isAiFocusConnector = aiFocusConnectorIds.has(id);
              const isActive = activeConnSet.has(id);
              const isSoftSuggest =
                suggestConnSet.has(id) &&
                (mapInteractionState === "role_selected" ||
                  mapInteractionState === "node_selected");
              const isSoftCommit =
                mapInteractionState === "node_selected" && softCommitConnSet.has(id);
              /** Dashed “suggested” styling for role-relevant paths; active path stays solid via isActive. */
              const isHighlightedTier =
                !isActive && (isSoftSuggest || isSoftCommit);

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const d = `M ${p1.x} ${p1.y} Q ${p1.x} ${midY} ${midX} ${midY} T ${p2.x} ${p2.y}`;

              let stroke;
              let strokeOpacity;
              let strokeWidth;
              let markerEndUrl;
              let strokeDasharray;
              let animateDash = false;

              if (isAiFocusConnector) {
                const aiDiplomaNeedsExplore = type === "diplomaPath" && !isExploreNext;
                stroke = aiDiplomaNeedsExplore ? "#4b5563" : "#2563eb";
                strokeOpacity = aiDiplomaNeedsExplore
                  ? isMapActive
                    ? 0.75
                    : 0.45
                  : 0.72;
                strokeWidth = 2.5;
                strokeDasharray =
                  type === "diplomaPath" && isExploreNext ? "5 5" : "8 6";
                markerEndUrl =
                  type === "diplomaPath" && !isExploreNext
                    ? "url(#arrowhead-relevant)"
                    : "url(#arrowhead-blue)";
                animateDash = true;
              } else if (isActive) {
                stroke = type === "diplomaPath" ? "#1d4ed8" : "#111827";
                strokeOpacity = isMapActive ? 0.95 : 0.6;
                strokeWidth = type === "diplomaPath" ? 2.6 : 3;
                strokeDasharray = "none";
                markerEndUrl = "url(#arrowhead-relevant)";
              } else if (isHighlightedTier) {
                stroke = type === "diplomaPath" ? "#3b82f6" : "#4b5563";
                strokeOpacity = isMapActive ? 0.55 : 0.38;
                strokeWidth = type === "diplomaPath" ? 2 : 2.2;
                strokeDasharray = type === "diplomaPath" ? "6 5" : "7 6";
                markerEndUrl =
                  type === "core" ? "url(#arrowhead-relevant)" : undefined;
                animateDash = true;
              } else {
                /**
                 * Structural baseline: keep the full pyramid readable so every path
                 * still reads as “there”; only the chosen route uses the solid tier above.
                 */
                const structural = isMapActive && (type === "core" || type === "diplomaPath");
                if (type === "core") {
                  stroke = structural ? "#9ca3af" : "#e5e7eb";
                  strokeOpacity = structural
                    ? mapInteractionState === "node_selected"
                      ? 0.42
                      : 0.48
                    : !isMapActive
                      ? 0.38
                      : 0.28;
                } else if (type === "diplomaPath") {
                  stroke = structural ? "#94a3b8" : "#e2e8f0";
                  strokeOpacity = structural
                    ? mapInteractionState === "node_selected"
                      ? 0.4
                      : 0.46
                    : !isMapActive
                      ? 0.36
                      : 0.26;
                } else {
                  stroke = "#f1f5f9";
                  strokeOpacity = !isMapActive ? 0.34 : 0.18;
                }
                strokeWidth = structural ? 1.35 : 1;
                markerEndUrl = undefined;
                strokeDasharray =
                  type === "core" ? "7 7" : type === "diplomaPath" ? "5 6" : "5 5";
              }

              return (
                <path
                  key={id}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={strokeOpacity}
                  markerEnd={markerEndUrl}
                  strokeDasharray={strokeDasharray === "none" ? undefined : strokeDasharray}
                  className="transition-all duration-500"
                >
                  {animateDash && strokeDasharray && strokeDasharray !== "none" && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="12;0"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  )}
                </path>
              );
            })}
          </svg>

          <div className="relative z-[2] flex flex-col gap-6 md:gap-8 lg:gap-10">
            {/* Top tier: 3 diplomas (value add) */}
            <div className={`${PYRAMID_GRID} shrink-0 items-end`}>
              {DIPLOMA_PLACEMENT.map(({ id, col }) => (
                <PyramidSlot key={id} colStart={col} align="end">
                  {renderMapNode(id)}
                </PyramidSlot>
              ))}
            </div>

            <div
              className="mx-2 shrink-0 border-t border-gray-300/80 md:mx-6"
              aria-hidden
            />

            {/* Middle tier: 4 journey steps */}
            <div
              className={`${PYRAMID_GRID} shrink-0 items-center py-2 md:py-3`}
            >
              {JOURNEY_PLACEMENT.map(({ id, col }) => (
                <PyramidSlot key={id} colStart={col}>
                  {renderMapNode(id)}
                </PyramidSlot>
              ))}
            </div>

            <div
              className="mx-2 shrink-0 border-t border-gray-300/80 md:mx-6"
              aria-hidden
            />

            {/* Base tier: 5 hotel roles */}
            <div
              className={`${PYRAMID_GRID} shrink-0 items-end pt-1 md:pt-2`}
            >
              {ROLE_PLACEMENT.map(({ id, col }) => (
                <PyramidSlot key={id} colStart={col} align="end">
                  {renderMapNode(id)}
                </PyramidSlot>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
