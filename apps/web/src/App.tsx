import { useState, useRef, useCallback, useMemo } from "react";
import { useSiteContent, useT } from "./content/ContentProvider";
import { Reveal } from "./components/motion";
import type { IntentValue, NodeType, UserContext } from "./types/content";
import type { PathAiFocus } from "./data/pathAi";
import Header from "./components/Header";
import HeroVideoSection from "./components/HeroVideoSection";
import IntroSection from "./components/IntroSection";
import SellingPointsGrid from "./components/SellingPointsGrid";
import NavigatorControls from "./components/NavigatorControls";
import MapCanvas from "./components/MapCanvas";
import RoutePanel from "./components/RoutePanel";
import MobileDrawer from "./components/MobileDrawer";
import Container from "./components/Container";
import ManagerSupportSection from "./components/ManagerSupportSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import IntentSelector from "./components/IntentSelector";
import {
  getCommittedHighlightNodeIds,
  getCommittedSoftConnectionIds,
  getConnectionsForSelection,
  getProgrammeById,
  getRelevantPathsForRole,
  getRoleById,
  getSuggestHighlightNodeIds,
  inferAnchorRoleForProgramme,
  intersectSuggestNodesWithPersona,
  MAP_MODE,
} from "./data/contentModel";

function App() {
  const { personas } = useSiteContent();
  const t = useT();
  const navigatorRef = useRef<HTMLElement>(null);
  const orientationRef = useRef<HTMLDivElement>(null);

  const [leaderMode, setLeaderMode] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(
    null,
  );
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(
    null,
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null,
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("30 minutes");
  const [aiFocus, setAiFocus] = useState<PathAiFocus | null>(null);

  const selectedRoleId = userContext?.currentRoleId ?? null;

  const mapInteractionState = useMemo(() => {
    if (!selectedRoleId) return "idle";
    if (selectedNodeType === "role") return "role_selected";
    if (selectedNodeType === "core" || selectedNodeType === "advanced") {
      return "node_selected";
    }
    return "idle";
  }, [selectedRoleId, selectedNodeType]);

  /** Same “relevant routes” as role click: stay dashed when a programme is selected; only activeConnectionIds go solid. */
  const highlightedConnectionIds = useMemo(() => {
    if (!selectedRoleId) return [];
    if (
      mapInteractionState !== "role_selected" &&
      mapInteractionState !== "node_selected"
    ) {
      return [];
    }
    return getRelevantPathsForRole(selectedRoleId);
  }, [selectedRoleId, mapInteractionState]);

  const activeConnectionIds = useMemo(() => {
    if (
      !selectedRoleId ||
      mapInteractionState !== "node_selected" ||
      !selectedNodeId
    ) {
      return [];
    }
    return getConnectionsForSelection(selectedRoleId, selectedNodeId);
  }, [selectedRoleId, mapInteractionState, selectedNodeId]);

  const softConnectionIdsForCommit = useMemo(() => {
    if (
      !selectedRoleId ||
      mapInteractionState !== "node_selected" ||
      selectedNodeType !== "advanced"
    ) {
      return [];
    }
    return getCommittedSoftConnectionIds(
      selectedRoleId,
      selectedNodeId,
      selectedNodeType,
    );
  }, [selectedRoleId, mapInteractionState, selectedNodeType, selectedNodeId]);

  const highlightedNodeIds = useMemo(() => {
    if (!selectedRoleId) return [];
    if (mapInteractionState === "role_selected") {
      const soft = getSuggestHighlightNodeIds(selectedRoleId);
      return intersectSuggestNodesWithPersona(soft, selectedPersonaId);
    }
    if (mapInteractionState === "node_selected" && selectedNodeType) {
      return getCommittedHighlightNodeIds(
        selectedRoleId,
        selectedNodeId,
        selectedNodeType,
      );
    }
    return [];
  }, [
    selectedRoleId,
    mapInteractionState,
    selectedNodeId,
    selectedNodeType,
    selectedPersonaId,
  ]);

  const handleSelectIntent = (intent: IntentValue) => {
    if (intent === "selfGrowth") {
      navigatorRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (intent === "developingTeam") {
      setLeaderMode(true);
      navigatorRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (intent === "learnAbout") {
      orientationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTimeFilterChange = useCallback(
    (value: string) => {
      setTimeFilter(value);
      if (userContext?.currentRoleId) {
        setUserContext((prev) =>
          prev ? { ...prev, mapMode: MAP_MODE.startNow } : prev,
        );
        setMobileDrawerOpen(true);
      }
    },
    [userContext?.currentRoleId],
  );

  const handleNavigatorRoleChange = useCallback((roleId: string) => {
    if (!roleId) {
      setUserContext(null);
      setSelectedNodeId(null);
      setSelectedNodeType(null);
      return;
    }
    setUserContext({
      currentRoleId: roleId,
      mapMode: MAP_MODE.exploreNext,
    });
    setSelectedNodeId(roleId);
    setSelectedNodeType("role");
    setSelectedStoryId(null);
    setSelectedProgrammeId(null);
    setAiFocus(null);
  }, []);

  const handleMapNodeSelect = useCallback(
    (nodeId: string) => {
      setSelectedStoryId(null);
      setSelectedProgrammeId(null);
      setAiFocus(null);
      setMobileDrawerOpen(true);

      if (getRoleById(nodeId)) {
        setUserContext({
          currentRoleId: nodeId,
          mapMode: MAP_MODE.exploreNext,
        });
        setSelectedNodeId(nodeId);
        setSelectedNodeType("role");
        return;
      }

      const prog = getProgrammeById(nodeId);
      if (!prog) return;

      let anchor = userContext?.currentRoleId ?? null;
      if (!anchor) anchor = inferAnchorRoleForProgramme(nodeId);
      if (!anchor) return;

      let edges = getConnectionsForSelection(anchor, nodeId);
      if (edges.length === 0) {
        const inferred = inferAnchorRoleForProgramme(nodeId);
        if (inferred) {
          anchor = inferred;
          edges = getConnectionsForSelection(anchor, nodeId);
        }
      }

      setUserContext({
        currentRoleId: anchor,
        mapMode: MAP_MODE.exploreNext,
      });
      setSelectedNodeId(nodeId);
      setSelectedNodeType(prog.type === "advanced" ? "advanced" : "core");
    },
    [userContext?.currentRoleId],
  );

  const handleOpenDrawer = () => setMobileDrawerOpen(true);

  const handleCloseDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div
      id="top"
      className="flex min-w-0 flex-col overflow-x-hidden bg-background text-foreground"
    >
      <Header />

      <main className="flex min-w-0 flex-col">
        <div className="shrink-0">
          <HeroVideoSection />
        </div>

        <div ref={orientationRef} className="shrink-0">
          <Container>
            <IntroSection />
          </Container>
        </div>

        {/* Full-bleed carousel: manages its own container inset internally. */}
        <div className="shrink-0">
          <SellingPointsGrid />
        </div>

        <section className="shrink-0" aria-label="Choose your intent">
          <IntentSelector onSelectIntent={handleSelectIntent} />
        </section>

        <section
          ref={navigatorRef}
          id="growth-navigator"
          className="flex w-full min-w-0 shrink-0 flex-col border-t bg-muted/40 px-3 py-12 md:px-6 md:py-16"
        >
          <Reveal>
            <div className="mx-auto mb-8 w-full max-w-[1800px] text-center">
              <span className="rounded-full bg-background px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground shadow-xs">
                {t("navigator.kicker")}
              </span>
              <h2 className="text-gradient-brand mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                {t("navigator.heading")}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                {t("navigator.sub")}
              </p>
            </div>
          </Reveal>

          <div className="mx-auto flex w-full max-w-full flex-col overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/10 ring-1 ring-black/5 md:max-w-[1800px] md:flex-row md:items-stretch">
            <div className="relative flex min-h-[320px] min-w-0 w-full flex-col md:min-h-0 md:min-w-0 md:flex-1">
              {selectedPersonaId && (
                <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b bg-background px-4 py-3">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("navigator.tailored")}
                    </span>
                    <p className="mt-0.5 text-sm text-foreground">
                      {personas.find((p) => p.id === selectedPersonaId)?.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPersonaId(null)}
                    className="shrink-0 text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    {t("navigator.change")}
                  </button>
                </div>
              )}
              <div className="relative flex min-h-[320px] min-w-0 w-full max-w-full flex-1 flex-col md:min-h-0">
                <button
                  type="button"
                  onClick={handleOpenDrawer}
                  className="glass absolute left-3 top-3 z-10 rounded-full px-4 py-2 text-sm font-medium text-foreground shadow-sm md:hidden"
                >
                  {t("navigator.searchFilters")}
                </button>
                <MapCanvas
                  userContext={{ ...userContext, selectedPersonaId }}
                  highlightedNodeIds={highlightedNodeIds}
                  highlightedConnectionIds={highlightedConnectionIds}
                  activeConnectionIds={activeConnectionIds}
                  softConnectionIdsForCommit={softConnectionIdsForCommit}
                  mapInteractionState={mapInteractionState}
                  selectedNodeId={selectedNodeId}
                  selectedProgrammeId={selectedProgrammeId}
                  onSelectMapNode={handleMapNodeSelect}
                  openDrawer={handleOpenDrawer}
                  aiFocus={aiFocus}
                />
              </div>
            </div>

            {/* Fixed-height companion panel: content scrolls inside it, so the
                frame never jumps as selections change. */}
            <aside className="hidden md:flex md:h-[min(78vh,720px)] md:w-96 md:flex-shrink-0 md:flex-col md:overflow-hidden md:border-l md:border-white/50 md:bg-white/55 md:backdrop-blur-xl">
              <div className="min-h-0 flex-1 overflow-hidden p-3">
                <RoutePanel
                  selectedNodeId={selectedNodeId}
                  selectedNodeType={selectedNodeType}
                  mapInteractionState={mapInteractionState}
                  selectedStoryId={selectedStoryId}
                  selectedProgrammeId={selectedProgrammeId}
                  userContext={{ ...userContext, selectedPersonaId }}
                  selectedPersonaId={selectedPersonaId}
                  leaderMode={leaderMode}
                  onActivateNode={handleMapNodeSelect}
                  onAiFocusChange={setAiFocus}
                />
              </div>
            </aside>
          </div>

          <MobileDrawer
            open={mobileDrawerOpen}
            onClose={handleCloseDrawer}
          >
            <div className="flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-200 p-3">
                <NavigatorControls
                  onRoleChange={handleNavigatorRoleChange}
                  timeFilter={timeFilter}
                  onTimeFilterChange={handleTimeFilterChange}
                  userContext={userContext}
                />
              </div>
              <div className="flex-1 overflow-auto p-4">
                <RoutePanel
                  selectedNodeId={selectedNodeId}
                  selectedNodeType={selectedNodeType}
                  mapInteractionState={mapInteractionState}
                  selectedStoryId={selectedStoryId}
                  selectedProgrammeId={selectedProgrammeId}
                  userContext={{ ...userContext, selectedPersonaId }}
                  selectedPersonaId={selectedPersonaId}
                  leaderMode={leaderMode}
                  onClose={handleCloseDrawer}
                  onActivateNode={handleMapNodeSelect}
                  onAiFocusChange={setAiFocus}
                />
              </div>
            </div>
          </MobileDrawer>
        </section>

        <div className="shrink-0">
          <ManagerSupportSection />
        </div>

        <div className="shrink-0">
          <FAQSection />
        </div>

        <div className="shrink-0">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
