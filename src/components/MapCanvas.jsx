import { useEffect } from "react";
import RouteNode from "./RouteNode";
import StoryPin from "./StoryPin";
import { stories, programmes } from "../data/contentModel";

const CARD_WIDTH = 200;
const GAP = 12;

const ROLE_LABEL_TO_ID = {
  housekeeping: "frontline",
  frontline: "frontline",
  supervisor: "supervisor",
  manager: "manager",
  "senior manager": "senior_manager",
  "general manager": "general_manager",
};

function pathDescriptionToRoleIds(pathDescription) {
  const parts = pathDescription
    .split(/\s*→\s*|\s+to\s+/i)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const ids = [];
  for (const part of parts) {
    const id = ROLE_LABEL_TO_ID[part];
    if (id) ids.push(id);
  }
  return ids;
}

function getStoryTransitions(pathDescription) {
  const roleIds = pathDescriptionToRoleIds(pathDescription);
  const pairs = [];
  for (let i = 0; i < roleIds.length - 1; i++) {
    pairs.push([roleIds[i], roleIds[i + 1]]);
  }
  return pairs;
}

function getStoriesBySegment(steps, storiesList) {
  const roleStepIndices = steps
    .map((s, i) => (s.type === "role" ? i : -1))
    .filter((i) => i >= 0);
  const segmentToStory = new Map();
  for (const story of storiesList) {
    const transitions = getStoryTransitions(story.pathDescription);
    for (let r = 0; r < roleStepIndices.length - 1; r++) {
      const fromIdx = roleStepIndices[r];
      const toIdx = roleStepIndices[r + 1];
      const fromRoleId = steps[fromIdx].roleId;
      const toRoleId = steps[toIdx].roleId;
      const matches = transitions.some(
        ([from, to]) => from === fromRoleId && to === toRoleId
      );
      if (matches && !segmentToStory.has(fromIdx)) {
        segmentToStory.set(fromIdx, story);
        break;
      }
    }
  }
  return segmentToStory;
}

function ProgrammeCard({ programme, onClick, isSelected }) {
  const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(programme.title)}`;
  return (
    <button
      type="button"
      onClick={onClick}
      data-programme-id={programme.id}
      className={`flex min-w-[180px] max-w-[180px] flex-shrink-0 flex-col overflow-hidden rounded-lg border text-left shadow-sm transition-colors md:min-w-[200px] md:max-w-[200px] ${
        isSelected
          ? "border-gray-800 bg-gray-100 ring-2 ring-gray-800 ring-offset-2"
          : "border-gray-300 bg-white hover:bg-gray-50"
      }`}
    >
      <img
        src={imgSrc}
        alt=""
        className="h-24 w-full object-cover md:h-28"
      />
      <div className="flex flex-1 flex-col p-3">
        <span className="line-clamp-2 text-xs font-medium text-gray-800 md:text-sm">
          {programme.title}
        </span>
      </div>
    </button>
  );
}

export default function MapCanvas({
  currentRoute,
  selectedNodeId,
  onSelectNode,
  onSelectStory,
  onSelectProgramme,
  openDrawer,
  selectedPersonaId,
  onSelectPersona,
  PersonaQualifierComponent,
}) {
  const selectedProgrammeIdFromNode =
    selectedNodeId?.startsWith("programme_") ?
      selectedNodeId.slice("programme_".length)
    : null;

  useEffect(() => {
    if (!selectedProgrammeIdFromNode) return;
    const card = document.querySelector(
      `[data-programme-id="${selectedProgrammeIdFromNode}"]`
    );
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedProgrammeIdFromNode]);

  const scrollCarousel = (dir) => {
    const el = document.querySelector(".programme-explorer-carousel");
    if (!el) return;
    const step = (CARD_WIDTH + GAP) * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  if (!currentRoute?.steps?.length) {
    return (
      <div className="flex h-full min-h-[300px] flex-col bg-gray-100 md:min-h-full">
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-auto p-8">
          {/* Empty state: ghost route spine and nodes */}
          <div
            className="absolute inset-0 flex items-center justify-center md:inset-x-6 md:inset-y-auto md:top-1/2 md:bottom-auto md:h-24 md:-translate-y-1/2"
            aria-hidden
          >
            <div className="absolute left-1/2 top-16 bottom-24 w-0.5 -translate-x-1/2 rounded-full bg-gray-300 opacity-30 md:hidden" />
            <svg
              className="hidden h-full w-full md:block"
              viewBox="0 0 400 100"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,25 100,75 200,25 300,75 400,25"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.3}
              />
            </svg>
          </div>
          <div className="absolute flex flex-col items-center gap-y-6 md:flex-row md:gap-x-8 md:gap-y-0 md:opacity-30" aria-hidden>
            {["Start", "Next step", "Next step", "Destination"].map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-400 bg-transparent" />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            {selectedPersonaId ? (
              <p className="text-center text-gray-600">
                Choose your current role and destination, then click Find Route.
              </p>
            ) : PersonaQualifierComponent ? (
              <div className="w-full max-w-md">
                <PersonaQualifierComponent
                  selectedPersonaId={selectedPersonaId}
                  onSelectPersona={onSelectPersona}
                />
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Choose your current role and destination, then click Find Route.
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-gray-300 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-700">
              Programme Explorer
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => scrollCarousel("prev")}
                aria-label="Previous programmes"
                className="rounded border border-gray-400 bg-white p-1.5 shadow-sm"
              >
                <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("next")}
                aria-label="Next programmes"
                className="rounded border border-gray-400 bg-white p-1.5 shadow-sm"
              >
                <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-gray-700" />
              </button>
            </div>
          </div>
          <div
            className="programme-explorer-carousel mt-3 flex gap-3 overflow-x-auto scroll-smooth py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {programmes.map((p) => (
              <ProgrammeCard
                key={p.id}
                programme={p}
                isSelected={selectedProgrammeIdFromNode === p.id}
                onClick={() => {
                  onSelectProgramme?.(p.id);
                  openDrawer?.();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const steps = currentRoute.steps;
  const firstRoleId = steps.find((s) => s.type === "role")?.id;
  const storyBySegment = getStoriesBySegment(steps, stories);
  const roleStepIndices = steps
    .map((s, i) => (s.type === "role" ? i : -1))
    .filter((i) => i >= 0);

  const gridBackground = {
    backgroundImage: [
      "repeating-linear-gradient(0deg, transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px)",
      "repeating-linear-gradient(90deg, transparent, transparent 23px, #e5e7eb 23px, #e5e7eb 24px)",
    ].join(", "),
  };

  const selectedIndex = steps.findIndex((s) => s.id === selectedNodeId);
  const currentIndex = steps.findIndex((s) => s.id === firstRoleId);

  return (
    <div className="flex h-full min-h-[300px] flex-col bg-gray-100 md:min-h-full">
      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-auto p-6"
        style={gridBackground}
      >
        {/* Path spine (behind nodes): desktop zig-zag, mobile vertical */}
        <div
          className="absolute inset-0 flex items-center justify-center md:inset-x-6 md:inset-y-auto md:top-1/2 md:bottom-auto md:h-24 md:-translate-y-1/2"
          aria-hidden
        >
          {/* Mobile: vertical spine */}
          <div className="absolute left-1/2 top-12 bottom-12 w-0.5 -translate-x-1/2 rounded-full bg-gray-300 opacity-60 md:hidden" />
          {/* Desktop: zig-zag spine SVG */}
          <svg
            className="hidden h-full w-full md:block"
            viewBox={`0 0 ${Math.max(100, (steps.length - 1) * 100)} 100`}
            preserveAspectRatio="none"
          >
            <polyline
              points={steps
                .map((_, i) => [(i * 100), (i % 2) * 50 + 25].join(","))
                .join(" ")}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6}
            />
          </svg>
        </div>

        <div className="relative z-0 flex flex-col items-center gap-y-4 md:flex-row md:items-center md:gap-x-12 md:gap-y-0">
          {steps.map((step, index) => {
            const segmentStory = step.type === "role" ? storyBySegment.get(index) : null;
            const nextRoleIdx = roleStepIndices[roleStepIndices.indexOf(index) + 1];
            const nextRoleStepId = nextRoleIdx != null ? steps[nextRoleIdx]?.id : null;
            const isHighlight =
              segmentStory &&
              (selectedNodeId === step.id || selectedNodeId === nextRoleStepId);
            const isSelected = step.id === selectedNodeId;
            const isFuture = index > selectedIndex && index !== currentIndex;
            const zigzagTranslate = index % 2 === 0 ? "md:translate-y-0" : "md:translate-y-12";
            const isRole = step.type === "role";
            const isDestination = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-y-4 md:flex-row md:gap-y-0 md:gap-x-0 ${zigzagTranslate} ${isFuture ? "opacity-80" : ""} ${isSelected ? "z-10 md:relative" : "relative"}`}
              >
                <div className="flex flex-col items-center md:flex-row">
                  {/* Map stop container: light pill around node + label */}
                  <div
                    className={`flex flex-col items-center rounded-xl border px-3 py-2 md:px-4 md:py-2.5 ${
                      isRole
                        ? "scale-110 border-gray-400 bg-white/90 shadow-md"
                        : "scale-95 border-gray-300 bg-white/80"
                    } ${isDestination ? "ring-2 ring-gray-700/50" : ""} ${isSelected ? "shadow-lg" : ""}`}
                  >
                    <RouteNode
                      type={step.type}
                      label={step.label}
                      nodeId={step.id}
                      nodeState={
                        step.id === selectedNodeId
                          ? "selected"
                          : step.id === firstRoleId && index === 0
                            ? "current"
                            : "future"
                      }
                      isFirstRole={
                        step.type === "role" &&
                        steps.findIndex((s) => s.type === "role") === index
                      }
                      stepNumber={index + 1}
                      isDestination={isDestination}
                      onClick={onSelectNode}
                    />
                  </div>

                  {index < steps.length - 1 && (
                    <>
                      {/* Connector: curved on desktop, vertical on mobile */}
                      <div className="flex flex-col items-center md:flex-row" aria-hidden>
                        {/* Mobile: vertical line */}
                        <div className="h-4 w-px shrink-0 bg-gray-400 md:hidden" />
                        {/* Desktop: curved SVG connector */}
                        <svg
                          className="hidden h-12 w-20 shrink-0 md:block"
                          viewBox="0 0 80 48"
                          aria-hidden
                        >
                          <path
                            d={
                              index % 2 === 0
                                ? "M 0 0 C 32 0, 48 48, 80 48"
                                : "M 0 48 C 32 48, 48 0, 80 0"
                            }
                            fill="none"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      {segmentStory && (
                        <>
                          <div className="flex flex-col items-center md:flex-row">
                            <div className="h-3 w-px shrink-0 bg-gray-400 md:hidden" aria-hidden />
                            <div className="flex flex-col items-center md:flex-row md:gap-x-2">
                              {/* Short connector from path to story pin (desktop: horizontal branch) */}
                              <div className="h-2 w-px bg-gray-400 md:h-0 md:w-4 md:border-t md:border-gray-400" aria-hidden />
                              <StoryPin
                                storyId={segmentStory.id}
                                name={segmentStory.name}
                                pathDescription={segmentStory.pathDescription}
                                onClick={onSelectStory}
                                isHighlight={!!isHighlight}
                              />
                              <div className="h-2 w-px bg-gray-400 md:hidden" aria-hidden />
                            </div>
                            <div className="h-3 w-px shrink-0 bg-gray-400 md:hidden" aria-hidden />
                            {/* Connector after story pin */}
                            <div className="h-4 w-px shrink-0 bg-gray-400 md:hidden" aria-hidden />
                            <svg
                              className="hidden h-12 w-20 shrink-0 md:block"
                              viewBox="0 0 80 48"
                              aria-hidden
                            >
                              <path
                                d={
                                  index % 2 === 0
                                    ? "M 0 0 C 32 0, 48 48, 80 48"
                                    : "M 0 48 C 32 48, 48 0, 80 0"
                                }
                                fill="none"
                                stroke="#9ca3af"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-300 bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-gray-700">
            Programme Explorer
          </h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollCarousel("prev")}
              aria-label="Previous programmes"
              className="rounded border border-gray-400 bg-white p-1.5 shadow-sm"
            >
              <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-r-[6px] border-r-gray-700" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("next")}
              aria-label="Next programmes"
              className="rounded border border-gray-400 bg-white p-1.5 shadow-sm"
            >
              <span className="block h-0 w-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-gray-700" />
            </button>
          </div>
        </div>
        <div
          className="programme-explorer-carousel mt-3 flex gap-3 overflow-x-auto scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {programmes.map((p) => (
            <ProgrammeCard
              key={p.id}
              programme={p}
              isSelected={selectedProgrammeIdFromNode === p.id}
              onClick={() => {
                onSelectProgramme?.(p.id);
                openDrawer?.();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
