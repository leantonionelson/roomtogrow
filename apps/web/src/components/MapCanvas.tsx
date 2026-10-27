import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BedDouble, Footprints, GraduationCap, MapPin } from "lucide-react";
import RouteNode, {
  type RouteNodeState,
  type RouteNodeTone,
} from "./RouteNode";
import MapViewport from "./MapViewport";
import { useSiteContent, useT } from "../content/ContentProvider";
import type { StringKey } from "../i18n/strings";
import type { SiteContent } from "../types/content";
import type { MapInteractionState, NavigatorUserContext } from "../types/ui";
import type { PathAiFocus } from "../data/pathAi";
import { MAP_CONNECTORS } from "../data/mapTopology";
import {
  getPastRoleIds,
  MAP_MODE,
  overviewLead,
  programmeRelevanceLine,
} from "../data/contentModel";

/**
 * Pyramid on a 9-column grid (IHG-style):
 * — Top: 3 diplomas / value-add (cols 3, 5, 7)
 * — Middle: 4 journey steps (cols 2, 4, 6, 8)
 * — Bottom: 5 hotel roles (cols 1, 3, 5, 7, 9)
 */
/** `minmax(0,1fr)` lets columns shrink so tiles + gaps fit the container width. */
const PYRAMID_GRID =
  "grid min-w-0 w-full grid-cols-[repeat(9,minmax(0,1fr))] gap-x-1 sm:gap-x-2 md:gap-x-3";

/** Tier dividers. */
const DIVIDER_INSET = "mx-2 md:mx-6";
/** Each tier's band label sits above it, so the tiles get the full width. */
const BAND_LABEL =
  "pointer-events-none z-[3] mb-1.5 inline-block rounded-md px-1.5 py-1 text-[9px] font-semibold uppercase leading-snug tracking-wider sm:text-[10px]";

/**
 * Tiles are square and sized by column width, capped by the frame height so
 * all three tiers fit on wide-but-short frames. 19.5rem ≈ everything in the
 * map's height that isn't a tile (padding, labels, dividers, minimum gaps).
 * `cqh` is the map viewport's height (a size container from md; on phones it
 * falls back to the screen height, which leaves the width in charge).
 */
const TILE_MAX_W = "max-w-[max(4rem,calc((100cqh-19.5rem)/3))]";

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

function getNodeSpec(
  nodeId: string,
  content: SiteContent,
): { nodeType: "role" | "programme"; label: string; id: string } | null {
  const r = content.roles.find((x) => x.id === nodeId);
  if (r) return { nodeType: "role", label: r.label, id: r.id };
  const p = content.programmes.find((x) => x.id === nodeId);
  if (p) return { nodeType: "programme", label: p.title, id: p.id };
  return null;
}

/** Summary line + CTA label for map tiles (tooltips + aria). */
function getMapTileCopy(
  nodeId: string,
  t: (key: StringKey) => string,
  content: SiteContent,
): {
  summaryLine: string;
  ctaLabel: string;
} {
  const roleEntity = content.roles.find((r) => r.id === nodeId);
  if (roleEntity) {
    return {
      summaryLine: overviewLead(roleEntity.overview),
      ctaLabel: t("map.seeOptions"),
    };
  }
  const progEntity = content.programmes.find((p) => p.id === nodeId);
  if (progEntity) {
    return {
      summaryLine: programmeRelevanceLine(progEntity),
      ctaLabel:
        progEntity.type === "advanced" ? t("panel.enrolNow") : t("panel.startNow"),
    };
  }
  return { summaryLine: "", ctaLabel: "" };
}

function PyramidSlot({
  colStart,
  children,
  align = "center",
}: {
  colStart: number;
  children: ReactNode;
  align?: "start" | "center" | "end";
}) {
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
  aiFocus,
}: {
  userContext: NavigatorUserContext | null;
  highlightedNodeIds?: string[];
  highlightedConnectionIds?: string[];
  activeConnectionIds?: string[];
  softConnectionIdsForCommit?: string[];
  mapInteractionState?: MapInteractionState;
  selectedNodeId?: string | null;
  selectedProgrammeId?: string | null;
  onSelectMapNode?: (nodeId: string) => void;
  openDrawer?: () => void;
  aiFocus?: PathAiFocus | null;
}) {
  const t = useT();
  const content = useSiteContent();
  const isMapActive = userContext != null;
  const mapMode = userContext?.mapMode ?? MAP_MODE.startNow;
  const isExploreNext = mapMode === MAP_MODE.exploreNext;
  /** The visitor's own role; an inferred route anchor doesn't count. */
  const chosenRoleId = userContext?.roleInferred ? null : (userContext?.currentRoleId ?? null);
  const pastRoleIds = chosenRoleId
    ? new Set(getPastRoleIds(chosenRoleId))
    : new Set<string>();

  const aiFocusNodeIds = new Set(aiFocus?.nodeIds ?? []);
  const aiFocusConnectorIds = new Set(aiFocus?.connectorIds ?? []);
  const hasAiFocus = aiFocusNodeIds.size > 0 || aiFocusConnectorIds.size > 0;

  const activeConnSet = new Set(activeConnectionIds);
  const suggestConnSet = new Set(highlightedConnectionIds);
  const softCommitConnSet = new Set(softConnectionIdsForCommit);
  const highlightedNodeSet = new Set(highlightedNodeIds);

  const mapRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const measureAnchors = useCallback(() => {
    const root = mapRef.current;
    if (!root) return;
    const mapRect = root.getBoundingClientRect();
    // The map sits inside a scaled viewport; rects are in screen space, but
    // the SVG shares the content's transform, so divide the zoom back out.
    const scale = root.offsetWidth ? mapRect.width / root.offsetWidth : 1;
    const next: Record<string, { x: number; y: number }> = {};
    root.querySelectorAll("[data-map-node]").forEach((el) => {
      const id = el.getAttribute("data-map-node");
      if (!id) return;
      const r = el.getBoundingClientRect();
      next[id] = {
        x: (r.left - mapRect.left + r.width / 2) / scale,
        y: (r.top - mapRect.top + r.height / 2) / scale,
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

  const renderMapNode = (nodeId: string) => {
    const spec = getNodeSpec(nodeId, content);
    if (!spec) return null;

    const isSelected =
      selectedNodeId === nodeId || selectedProgrammeId === nodeId;
    const isRelevant = highlightedNodeSet.has(nodeId);
    const isCurrentRole = chosenRoleId === nodeId;
    const isDiplomaNode = nodeId.startsWith("hospitality_diploma");
    const isAiFocusNode = aiFocusNodeIds.has(nodeId);
    const isSoftDiplomaSuggest =
      mapInteractionState === "role_selected" &&
      isDiplomaNode &&
      highlightedNodeSet.has(nodeId);
    const isPastRole =
      spec.nodeType === "role" && pastRoleIds.has(nodeId) && isExploreNext;
    const isJourneyNode = nodeId.startsWith("journey_");

    const tone: RouteNodeTone = isDiplomaNode
      ? "advanced"
      : isJourneyNode
        ? "core"
        : "role";
    const MarkerIcon = isDiplomaNode
      ? GraduationCap
      : isJourneyNode
        ? Footprints
        : BedDouble;

    let nodeState: RouteNodeState = "future";
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
        ? "ring-2 ring-brand-orange shadow-md"
        : isSoftDiplomaSuggest
          ? "ring-1 ring-ring border border-dashed border-ring"
          : "border-border";
    const cardPulse = isAiFocusNode && !isDiplomaNode ? "animate-pulse" : "";

    const optionalMapBadge = isSoftDiplomaSuggest ? t("map.optional") : undefined;
    const { summaryLine, ctaLabel } = getMapTileCopy(nodeId, t, content);
    const ariaLabel = [spec.label, optionalMapBadge, summaryLine, ctaLabel]
      .filter(Boolean)
      .join(". ");

    return (
      <div
        key={nodeId}
        data-map-node={nodeId}
        className={`relative flex w-full min-w-0 ${TILE_MAX_W} flex-col items-stretch transition-all duration-300 ${nodeOpacity} ${isSelected ? "z-10" : "z-0"}`}
      >
        {isCurrentRole && isMapActive && (
          <div
            className="pointer-events-none absolute -top-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-brand-orange px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white shadow-md sm:text-[10px]"
            aria-hidden
          >
            <MapPin className="h-2.5 w-2.5" aria-hidden />
            {t("map.youAreHere")}
          </div>
        )}
        {/* "Optional" sits on the tile's bottom edge rather than inside it, so
            it never squeezes the programme title. */}
        {optionalMapBadge && (
          <div
            className="pointer-events-none absolute -bottom-2.5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-dashed border-ring bg-background px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground shadow-xs sm:text-[10px]"
            aria-hidden
          >
            {optionalMapBadge}
          </div>
        )}
        <div
          // Inline-size container: the tile's label scales with the tile.
          className={`group relative flex aspect-square w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-all [container-type:inline-size] hover:scale-[1.03] hover:shadow-md ${cardRing} ${cardPulse}`}
        >
          {summaryLine ? (
            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden w-[min(12rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border bg-popover p-2.5 text-left shadow-md opacity-0 transition-opacity duration-150 sm:block sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              aria-hidden
            >
              <p className="text-xs font-semibold text-foreground">{spec.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {summaryLine}
              </p>
              <p className="mt-1.5 text-[11px] font-medium text-foreground underline underline-offset-2">
                {ctaLabel}
              </p>
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-1 py-1.5">
            <RouteNode
              label={spec.label}
              nodeId={spec.id}
              nodeState={nodeState}
              compactLabel={isJourneyNode}
              icon={<MarkerIcon className="h-3.5 w-3.5" aria-hidden />}
              tone={tone}
              uniformSquare
              ariaLabel={ariaLabel}
              onClick={(id) => {
                onSelectMapNode?.(id);
                openDrawer?.();
              }}
            />
          </div>
          {isSelected && summaryLine ? (
            <div className="shrink-0 border-t bg-muted/60 px-1 py-1.5 text-center sm:hidden">
              <p className="line-clamp-2 text-[9px] font-semibold text-foreground">
                {spec.label}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[8px] leading-tight text-muted-foreground">
                {summaryLine}
              </p>
              <p className="mt-0.5 text-[8px] font-medium text-foreground">
                {ctaLabel}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col bg-card">
      <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
        {/*
         * The pyramid keeps a minimum readable width (tiles never drop below
         * ~78px) and lives inside a pannable/zoomable viewport, so on small
         * screens users pan the map rather than squinting at shrunken tiles.
         */}
        <MapViewport
          focusSelector={
            chosenRoleId
              ? `[data-map-node="${chosenRoleId}"]`
              : undefined
          }
          background={
            /* Cartographic ground: fixed to the canvas; the map moves over it. */
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(42rem 22rem at 12% 0%, rgba(232,84,44,0.05), transparent 55%), radial-gradient(48rem 26rem at 90% 100%, rgba(31,68,86,0.07), transparent 60%), radial-gradient(rgba(31,68,86,0.10) 1px, transparent 1.5px)",
                backgroundSize: "auto, auto, 22px 22px",
              }}
            />
          }
        >
        <div
          // min-w at every size: wherever the frame is narrower than this
          // (phones, tablets, small laptops beside the panel) tiles keep a
          // readable size and the map pans instead of shrinking. Bottom
          // padding clears the pan/zoom hint in the corner.
          className="relative mx-auto flex h-full w-full min-w-[840px] max-w-[1920px] flex-col justify-center px-3 pb-11 pt-6 sm:px-5 lg:px-8"
        >
          {/* Ref on the map content so anchor math matches SVG (same coordinate
              origin). It grows to the frame height so the tiers spread out. */}
          <div ref={mapRef} className="relative flex min-w-0 flex-1 flex-col">
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
                <polygon points="0 0, 8 3, 0 6" fill="#e8542c" opacity="0.9" />
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

              let stroke: string;
              let strokeOpacity: number;
              let strokeWidth: number;
              let markerEndUrl: string | undefined;
              let strokeDasharray: string;
              let animateDash = false;

              if (isAiFocusConnector) {
                const aiDiplomaNeedsExplore = type === "diplomaPath" && !isExploreNext;
                stroke = aiDiplomaNeedsExplore ? "#4b5563" : "#e8542c";
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
                // Chosen route: Signature Orange dashes (design "interactive state").
                stroke = "#e8542c";
                strokeOpacity = isMapActive ? 0.95 : 0.6;
                strokeWidth = type === "diplomaPath" ? 2.2 : 2.4;
                strokeDasharray = "5 4";
                markerEndUrl = "url(#arrowhead-blue)";
              } else if (isHighlightedTier) {
                stroke = type === "diplomaPath" ? "#ef8666" : "#4b5563";
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

          {/* Tiers spread across the frame height (gap is the minimum when
              the frame is short); each carries its band label in the gutter. */}
          <div className="relative z-[2] flex flex-1 flex-col justify-between gap-6 md:gap-8">
            {/* Top tier: 3 accredited diplomas */}
            <div className="relative">
              <span className={`${BAND_LABEL} bg-orange-100/80 text-orange-800`} aria-hidden>
                {t("map.bandDiplomas")}
              </span>
              <div className={`${PYRAMID_GRID} shrink-0 items-end`}>
                {DIPLOMA_PLACEMENT.map(({ id, col }) => (
                  <PyramidSlot key={id} colStart={col} align="end">
                    {renderMapNode(id)}
                  </PyramidSlot>
                ))}
              </div>
            </div>

            <div className={`${DIVIDER_INSET} shrink-0 border-t border-gray-300/80`} aria-hidden />

            {/* Middle tier: 4 journey steps */}
            <div className="relative">
              <span className={`${BAND_LABEL} bg-primary/10 text-primary`} aria-hidden>
                {t("map.bandCore")}
              </span>
              <div className={`${PYRAMID_GRID} shrink-0 items-center py-2 md:py-3`}>
                {JOURNEY_PLACEMENT.map(({ id, col }) => (
                  <PyramidSlot key={id} colStart={col}>
                    {renderMapNode(id)}
                  </PyramidSlot>
                ))}
              </div>
            </div>

            <div className={`${DIVIDER_INSET} shrink-0 border-t border-gray-300/80`} aria-hidden />

            {/* Base tier: 5 hotel roles */}
            <div className="relative">
              <span className={`${BAND_LABEL} bg-muted text-muted-foreground`} aria-hidden>
                {t("map.bandRole")}
              </span>
              <div className={`${PYRAMID_GRID} shrink-0 items-end pt-1 md:pt-2`}>
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
        </MapViewport>
      </div>
    </div>
  );
}
