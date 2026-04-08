import RouteNode from "./RouteNode";
import { getActivePathState, programmes, roles } from "../data/contentModel";

// Layout configuration
const X_BASE = 140;
const X_STEP = 260; // Increased horizontal spread
const Y_BASE = 100;
const Y_STEP = 240; // Increased vertical spread

const MAP_WIDTH = X_BASE + 4 * X_STEP + 140;
const MAP_HEIGHT = Y_BASE + 2 * Y_STEP + 120;

const nodePositions = {
  // Roles (Bottom Layer: Y=2)
  "frontline": { x: 0, y: 2 },
  "supervisor": { x: 1, y: 2 },
  "manager": { x: 2, y: 2 },
  "senior_manager": { x: 3, y: 2 },
  "general_manager": { x: 4, y: 2 },

  // Core Learning/Transitional Leadership (Middle Layer: Y=1)
  "journey_supervisor": { x: 0.5, y: 1 },
  "journey_manager": { x: 1.5, y: 1 },
  "journey_senior_manager": { x: 2.5, y: 1 },
  "journey_gm": { x: 3.5, y: 1 },

  // Value Add learning/Applied Leadership (Top Layer: Y=0)
  "hospitality_diploma_3": { x: 1.5, y: 0 },
  "hospitality_diploma_4": { x: 2.5, y: 0 },
  "hospitality_diploma_5": { x: 3.5, y: 0 },
};

const connectors = [
  // Core progression connectors
  { id: "frontline->journey_supervisor", fromId: "frontline", toId: "journey_supervisor", type: "core" },
  { id: "journey_supervisor->supervisor", fromId: "journey_supervisor", toId: "supervisor", type: "core" },
  { id: "supervisor->journey_manager", fromId: "supervisor", toId: "journey_manager", type: "core" },
  { id: "journey_manager->manager", fromId: "journey_manager", toId: "manager", type: "core" },
  { id: "manager->journey_senior_manager", fromId: "manager", toId: "journey_senior_manager", type: "core" },
  { id: "journey_senior_manager->senior_manager", fromId: "journey_senior_manager", toId: "senior_manager", type: "core" },
  { id: "senior_manager->journey_gm", fromId: "senior_manager", toId: "journey_gm", type: "core" },
  { id: "journey_gm->general_manager", fromId: "journey_gm", toId: "general_manager", type: "core" },

  // Acceleration connectors
  { id: "supervisor->hospitality_diploma_3", fromId: "supervisor", toId: "hospitality_diploma_3", type: "acceleration" },
  { id: "hospitality_diploma_3->manager", fromId: "hospitality_diploma_3", toId: "manager", type: "acceleration" },
  { id: "manager->hospitality_diploma_4", fromId: "manager", toId: "hospitality_diploma_4", type: "acceleration" },
  { id: "hospitality_diploma_4->senior_manager", fromId: "hospitality_diploma_4", toId: "senior_manager", type: "acceleration" },
  { id: "senior_manager->hospitality_diploma_5", fromId: "senior_manager", toId: "hospitality_diploma_5", type: "acceleration" },
  { id: "hospitality_diploma_5->general_manager", fromId: "hospitality_diploma_5", toId: "general_manager", type: "acceleration" },

  // Fallback guidance connectors (subtle downward arrows)
  { id: "journey_supervisor->frontline", fromId: "journey_supervisor", toId: "frontline", type: "fallback" },
  { id: "journey_manager->supervisor", fromId: "journey_manager", toId: "supervisor", type: "fallback" },
  { id: "journey_senior_manager->manager", fromId: "journey_senior_manager", toId: "manager", type: "fallback" },
  { id: "journey_gm->senior_manager", fromId: "journey_gm", toId: "senior_manager", type: "fallback" },
];

export default function MapCanvas({
  userContext,
  highlightedNodeIds = [],
  selectedNodeId,
  onSelectNode,
  onShowOptions,
  onSelectProgramme,
  openDrawer,
  selectedPersonaId,
  onSelectPersona,
  PersonaQualifierComponent,
  aiFocus,
}) {
  const isMapActive = userContext != null;
  const pathState = getActivePathState(userContext);
  const activeCoreConnectorIds = new Set(pathState.coreConnectorIds);
  const activeAccelerationConnectorIds = new Set(pathState.accelerationConnectorIds);
  const activeFallbackConnectorIds = new Set(pathState.fallbackConnectorIds);
  const isAccelerationOn = Boolean(userContext?.acceleration);
  const aiFocusNodeIds = new Set(aiFocus?.nodeIds ?? []);
  const aiFocusConnectorIds = new Set(aiFocus?.connectorIds ?? []);
  const hasAiFocus = aiFocusNodeIds.size > 0 || aiFocusConnectorIds.size > 0;

  const getPx = (id) => {
    const pos = nodePositions[id] || { x: 0, y: 0 };
    return { x: X_BASE + pos.x * X_STEP, y: Y_BASE + pos.y * Y_STEP };
  };

  const allNodes = [
    ...roles.map(r => ({ ...r, nodeType: 'role', label: r.label })),
    ...programmes.map(p => ({ ...p, nodeType: 'programme', label: p.title }))
  ];

  return (
    <div className="flex h-full min-h-[300px] flex-col bg-gray-100 md:min-h-full">
      <div
        className="relative flex flex-1 flex-col overflow-auto bg-gray-100"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px)",
            "repeating-linear-gradient(90deg, transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px)",
          ].join(", "),
        }}
      >
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
          className="relative mx-auto my-auto transition-opacity duration-500"
          style={{ 
            width: MAP_WIDTH, 
            height: MAP_HEIGHT,
            opacity: (!isMapActive && !selectedPersonaId) ? 0.3 : 1
          }}
        >
          {/* Left axis labels */}
          <div className="pointer-events-none absolute left-3 top-0 z-10 flex h-full w-32 flex-col justify-between py-16">
            <div className="rounded-md border border-gray-200 bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
              Value Add Learning
            </div>
            <div className="rounded-md border border-gray-200 bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
              Core Learning
            </div>
            <div className="mt-2 rounded-md border border-gray-200 bg-white/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
              Hotel Role
            </div>
          </div>

          {/* Connectors (SVG rendering behind) */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead-dim"
                markerWidth="8"
                markerHeight="6"
                refX="4"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" opacity="0.3" />
              </marker>
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
            </defs>
            {connectors.map(({ id, fromId, toId, type }, i) => {
              const p1 = getPx(fromId);
              const p2 = getPx(toId);

              const isCoreActive = type === "core" && activeCoreConnectorIds.has(id);
              const isAccelerationActive =
                type === "acceleration" &&
                isAccelerationOn &&
                activeAccelerationConnectorIds.has(id);
              const isFallbackActive =
                type === "fallback" &&
                !isAccelerationOn &&
                activeFallbackConnectorIds.has(id);
              const isAiFocusConnector = aiFocusConnectorIds.has(id);

              let stroke = "#9ca3af";
              let strokeOpacity = !isMapActive ? 0.3 : 0.18;
              let strokeWidth = 1.5;

              if (isCoreActive) {
                stroke = "#374151";
                strokeOpacity = 0.9;
                strokeWidth = 3;
              } else if (isAccelerationActive) {
                stroke = "#2563eb";
                strokeOpacity = 0.72;
                strokeWidth = 2.4;
              } else if (isAiFocusConnector) {
                stroke = "#1d4ed8";
                strokeOpacity = 0.68;
                strokeWidth = 2.5;
              } else if (type === "fallback") {
                stroke = "#9ca3af";
                strokeOpacity = !isMapActive ? 0.2 : isAccelerationOn ? 0.05 : 0.2;
                strokeWidth = 1.4;
              }

              // Quadratic bezier for soft curves
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              
              const d = `M ${p1.x} ${p1.y} Q ${p1.x} ${midY} ${midX} ${midY} T ${p2.x} ${p2.y}`;

              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={strokeOpacity}
                  markerEnd={
                    isCoreActive || isAccelerationActive || isFallbackActive || isAiFocusConnector
                      ? "url(#arrowhead-relevant)"
                      : "url(#arrowhead-dim)"
                  }
                  strokeDasharray={isCoreActive || isAccelerationActive || isAiFocusConnector ? "8 6" : "none"}
                  className="transition-all duration-500"
                >
                  {(isCoreActive || isAccelerationActive || isAiFocusConnector) && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values={isCoreActive ? "14;0" : "10;0"}
                      dur={isCoreActive ? "1.8s" : "2.2s"}
                      repeatCount="indefinite"
                    />
                  )}
                </path>
              );
            })}
          </svg>

          {/* Nodes */}
          {allNodes.map(node => {
            const pos = getPx(node.id);
            if (!nodePositions[node.id]) return null;

            const isSelected = selectedNodeId === node.id;
            const isRelevant = highlightedNodeIds.includes(node.id);
            const isCurrentRole = userContext?.currentRoleId === node.id;
            const isDiplomaNode = node.id.startsWith("hospitality_diploma");
            const isAiFocusNode = aiFocusNodeIds.has(node.id);
            
            // State derivation:
            let nodeState = "future";
            if (isSelected) nodeState = "selected";
            else if (isCurrentRole) nodeState = "current";

            // Determine opacity based on relevance
            let nodeOpacity = !isMapActive ? "opacity-100" : (isRelevant || isSelected ? "opacity-100" : "opacity-40");
            if (isMapActive && isDiplomaNode && !isAccelerationOn && !isSelected) {
              nodeOpacity = "opacity-25";
            }
            if (hasAiFocus && isAiFocusNode) {
              nodeOpacity = "opacity-100";
            }

            return (
              <div
                key={node.id}
                className={`group absolute flex flex-col items-center justify-center transition-all duration-300 ${nodeOpacity} ${isSelected ? "z-10" : "z-0"}`}
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div
                  className={`flex flex-col items-center rounded-xl border px-3 py-2 bg-white/90 shadow-sm transition-all hover:scale-105 ${
                    isSelected || isAiFocusNode ? "ring-2 ring-gray-700 shadow-md" : "border-gray-300"
                  } ${
                    isAiFocusNode ? "animate-pulse" : ""
                  }`}
                >
                  <RouteNode
                    type={node.nodeType}
                    label={node.label}
                    nodeId={node.id}
                    nodeState={nodeState}
                    isFirstRole={isCurrentRole}
                    onClick={(id) => {
                      onSelectNode(id);
                      if (node.nodeType === 'programme' && onSelectProgramme) {
                        onSelectProgramme(id);
                      }
                      openDrawer?.();
                    }}
                  />
                  {node.nodeType === "role" && node.id !== "general_manager" && (
                    <div className="mt-2 flex w-full flex-col gap-2">
                      {(() => {
                        const isFrontlineRole = node.id === "frontline";
                        const isRoleContext = userContext?.currentRoleId === node.id;
                        const roleAcceleration = isRoleContext ? Boolean(userContext?.acceleration) : false;
                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => onShowOptions?.(node.id, roleAcceleration)}
                              className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700"
                            >
                              Continue your journey
                            </button>
                            {!isFrontlineRole && (
                              <>
                                <label className="flex items-center justify-between rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700">
                                  <span className="font-medium">Add accelerated learning</span>
                                  <span className="relative inline-flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={roleAcceleration}
                                      onChange={() => onShowOptions?.(node.id, !roleAcceleration)}
                                      className="peer sr-only"
                                    />
                                    <span className="h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600" />
                                    <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                                  </span>
                                </label>
                                <p className="text-center text-[10px] text-gray-600">{roleAcceleration ? "Accelerated pace" : "Standard pace"}</p>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
