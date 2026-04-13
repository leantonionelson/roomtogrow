import { useState, useRef, useCallback, useMemo } from "react";
import Header from "./components/Header";
import HeroVideoSection from "./components/HeroVideoSection";
import IntroSection from "./components/IntroSection";
import SellingPointsGrid from "./components/SellingPointsGrid";
import NavigatorControls from "./components/NavigatorControls";
import PersonaQualifier from "./components/PersonaQualifier";
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
  personas,
} from "./data/contentModel";

function App() {
  const navigatorRef = useRef(null);
  const intentSectionRef = useRef(null);
  const orientationRef = useRef(null);

  const [leaderMode, setLeaderMode] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  /** @type {null | "role" | "core" | "advanced"} */
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("30 minutes");
  const [aiFocus, setAiFocus] = useState(null);

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

  const handleStartExploring = () => {
    intentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLeaderMode = () => {
    setLeaderMode(true);
    navigatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectIntent = (intent) => {
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
    (value) => {
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

  const handleNavigatorRoleChange = useCallback((roleId) => {
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
    (nodeId) => {
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

  const handleSelectStory = (storyId) => {
    setSelectedStoryId(storyId);
    setSelectedNodeId(null);
    setSelectedNodeType(null);
    setSelectedProgrammeId(null);
    setMobileDrawerOpen(true);
    setUserContext((prev) =>
      prev ? { ...prev, mapMode: MAP_MODE.exploreNext } : prev,
    );
  };

  const handleSelectProgramme = (programmeId) => {
    const prog = getProgrammeById(programmeId);
    setSelectedStoryId(null);
    setSelectedProgrammeId(null);
    setMobileDrawerOpen(true);
    setAiFocus(null);
    if (!prog) {
      setSelectedNodeId(null);
      setSelectedNodeType(null);
      return;
    }
    let anchor = userContext?.currentRoleId ?? inferAnchorRoleForProgramme(programmeId);
    if (!anchor) {
      setSelectedNodeId(null);
      setSelectedNodeType(null);
      return;
    }
    let edges = getConnectionsForSelection(anchor, programmeId);
    if (edges.length === 0) {
      const inferred = inferAnchorRoleForProgramme(programmeId);
      if (inferred) {
        anchor = inferred;
      }
    }
    setUserContext({
      currentRoleId: anchor,
      mapMode: MAP_MODE.exploreNext,
    });
    setSelectedNodeId(programmeId);
    setSelectedNodeType(prog.type === "advanced" ? "advanced" : "core");
  };

  const handleOpenDrawer = () => setMobileDrawerOpen(true);

  const handleCloseDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div className="flex min-w-0 flex-col overflow-x-hidden bg-gray-50 text-gray-800">
      <Header />

      <main className="flex min-w-0 flex-col">
        <div className="shrink-0">
          <HeroVideoSection
            onStartExploring={handleStartExploring}
            onLeaderMode={handleLeaderMode}
          />
        </div>

        <section ref={intentSectionRef} className="shrink-0" aria-label="Choose your intent">
          <IntentSelector onSelectIntent={handleSelectIntent} />
        </section>

        <div ref={orientationRef} className="shrink-0">
          <Container>
            <IntroSection />
          </Container>
        </div>

        <Container className="shrink-0">
          <SellingPointsGrid />
        </Container>

        <section
          ref={navigatorRef}
          id="growth-navigator"
          className="flex w-full min-w-0 shrink-0 flex-col border-t border-gray-300 bg-gray-100 px-3 py-3 pr-4 md:px-4 md:py-4 md:pr-6"
        >
          <div className="mx-auto flex w-full max-w-full flex-col overflow-hidden rounded-xl border-4 border-gray-300 bg-gray-100 p-3 md:max-w-[1800px] md:flex-row md:items-start md:p-4">
            <div className="relative flex min-h-[260px] min-w-0 w-full flex-col md:min-h-0 md:min-w-0 md:flex-1">
              {selectedPersonaId && (
                <div className="flex flex-shrink-0 items-start justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
                  <div>
                    <span className="text-xs font-medium text-gray-600">
                      Tailored for you
                    </span>
                    <p className="mt-0.5 text-sm text-gray-800">
                      {personas.find((p) => p.id === selectedPersonaId)?.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPersonaId(null)}
                    className="shrink-0 text-xs font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    Change
                  </button>
                </div>
              )}
              <div className="relative flex min-h-[260px] min-w-0 w-full max-w-full flex-col md:min-h-0 md:rounded-l-xl">
                <button
                  type="button"
                  onClick={handleOpenDrawer}
                  className="absolute left-2 top-2 z-10 rounded border border-gray-400 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow md:hidden"
                >
                  Search & filters
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
                  selectedPersonaId={selectedPersonaId}
                  onSelectPersona={setSelectedPersonaId}
                  PersonaQualifierComponent={PersonaQualifier}
                  aiFocus={aiFocus}
                />
              </div>
            </div>

            <aside className="hidden md:flex md:max-h-[min(90vh,920px)] md:w-96 md:flex-shrink-0 md:flex-col md:overflow-hidden md:rounded-l-none md:rounded-r-xl md:border-4 md:border-gray-300 md:bg-white md:shadow-sm">
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
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
