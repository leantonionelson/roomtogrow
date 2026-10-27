import { useState, useRef, useCallback, useMemo } from "react";
import { useSiteContent, useT } from "./content/ContentProvider";
import { Reveal } from "./components/motion";
import { useNavigatorPinned, usePinned } from "./lib/motion";
import type { IntentValue, NodeType, UserContext } from "./types/content";
import type { PathAiFocus } from "./data/pathAi";
import Header from "./components/Header";
import HeroVideoSection from "./components/HeroVideoSection";
import IntroSection from "./components/IntroSection";
import WhyRoomToGrow from "./components/WhyRoomToGrow";
import NavigatorControls from "./components/NavigatorControls";
import MapCanvas from "./components/MapCanvas";
import RoutePanel from "./components/RoutePanel";
import MobileDrawer from "./components/MobileDrawer";
import ManagerSupportSection from "./components/ManagerSupportSection";
import { SUPPORTING_TEAM_ID } from "./lib/anchors";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import IntentSelector from "./components/IntentSelector";
import textile from "./assets/brand/textile.jpg";
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

/** Scroll distance (vh) the Navigator stays pinned and spotlit. */
const NAV_DWELL_VH = 80;

function App() {
  const { personas } = useSiteContent();
  const t = useT();
  const navigatorRef = useRef<HTMLElement>(null);
  const navPinnable = useNavigatorPinned();
  /** The Navigator is pinned: spotlight it by dimming the rest of the page. */
  const navFocused = usePinned(navigatorRef, navPinnable);
  const orientationRef = useRef<HTMLDivElement>(null);

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
      // Managers go to the guidance written for them.
      document
        .getElementById(SUPPORTING_TEAM_ID)
        ?.scrollIntoView({ behavior: "smooth" });
    } else if (intent === "learnAbout") {
      orientationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      // A role the visitor chose stays put, even for a programme behind it
      // (shown without a route). Without one, anchor the route on the role
      // that leads into this programme, flagged so it isn't claimed as
      // theirs ("You are here", the manager-conversation copy).
      const chosenRole =
        userContext && !userContext.roleInferred ? userContext.currentRoleId : null;
      const anchor = chosenRole ?? inferAnchorRoleForProgramme(nodeId);
      if (!anchor) return;

      setUserContext({
        currentRoleId: anchor,
        mapMode: MAP_MODE.exploreNext,
        roleInferred: !chosenRole,
      });
      setSelectedNodeId(nodeId);
      setSelectedNodeType(prog.type === "advanced" ? "advanced" : "core");
    },
    [userContext],
  );

  const handleOpenDrawer = () => setMobileDrawerOpen(true);

  const handleCloseDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div
      id="top"
      className="flex min-w-0 flex-col overflow-x-clip bg-background text-foreground"
    >
      <Header />

      {/* Spotlight: dims everything except the Navigator while it is pinned
          (the Navigator's heading and frame sit above this layer). */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-30 bg-brand-ink/80 transition-opacity duration-500 ${
          navFocused ? "opacity-100" : "opacity-0"
        }`}
      />

      <main className="flex min-w-0 flex-col">
        <div className="shrink-0">
          <HeroVideoSection />
        </div>

        <div className="shrink-0">
          <IntentSelector onSelectIntent={handleSelectIntent} />
        </div>

        <div ref={orientationRef} className="shrink-0">
          <IntroSection />
        </div>

        <div className="shrink-0">
          <WhyRoomToGrow />
        </div>

        {/* Desktop: the section is a scroll track and its content pins as one
            screen (96px clear of the nav, heading, 48px, frame, 48px) for
            NAV_DWELL_VH of scrolling. Elsewhere it flows normally, with no
            bottom padding: Supporting your team (also white) supplies the
            96px gap, so the two aren't 192px apart. */}
        <section
          ref={navigatorRef}
          id="growth-navigator"
          className="relative w-full min-w-0 shrink-0 bg-background"
          // Inline scroll margin: the global [id] anchor offset is unlayered
          // CSS and would beat a utility class. Links land on the pinned state.
          style={
            navPinnable
              ? { height: `calc(100vh + ${NAV_DWELL_VH}vh)`, scrollMarginTop: 0 }
              : undefined
          }
        >
          <div
            className={
              navPinnable
                ? // z-40: a sticky box is its own stacking layer, so it (not
                  // just its children) must sit above the spotlight overlay.
                  "sticky top-0 z-40 flex h-screen flex-col px-6"
                : "flex flex-col px-3 pt-16 md:px-6 md:pt-24"
            }
          >
            {/* Grows only once the frame reaches its max height. */}
            {navPinnable && <div className="min-h-24 flex-1" aria-hidden />}
            <Reveal className="relative z-40 shrink-0">
              <div className="mx-auto mb-12 w-full max-w-[1800px] text-center">
                <h2
                  className={`text-2xl font-normal transition-colors duration-500 md:text-[2rem] ${
                    navFocused ? "text-white" : "text-primary"
                  }`}
                >
                  {t("navigator.heading")}
                </h2>
                <p
                  className={`mx-auto mt-3 max-w-xl text-sm transition-colors duration-500 ${
                    navFocused ? "text-white/75" : "text-muted-foreground"
                  }`}
                >
                  {t("navigator.sub")}
                </p>
              </div>
            </Reveal>

            <div
              className={`relative z-40 mx-auto flex w-full max-w-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow duration-500 md:max-w-[1800px] md:flex-row md:items-stretch ${
                // Pinned: the frame takes the screen's spare height (up to
              // 960px), so the spacing around it stays fixed.
              navPinnable ? "max-h-[960px] min-h-0 flex-[999_1_0%]" : "md:h-[min(78vh,720px)]"
              } ${navFocused ? "shadow-2xl shadow-black/50" : "shadow-sm"}`}
            >
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
                    {t("navigator.chooseRole")}
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
              <aside
                className="hidden bg-cover bg-center md:flex md:h-full md:w-96 md:flex-shrink-0 md:flex-col md:overflow-hidden md:border-l"
                style={{ backgroundImage: `url(${textile})` }}
              >
                <div className="min-h-0 flex-1 overflow-hidden bg-white/45 p-3">
                  <RoutePanel
                    selectedNodeId={selectedNodeId}
                    selectedNodeType={selectedNodeType}
                    mapInteractionState={mapInteractionState}
                    selectedStoryId={selectedStoryId}
                    selectedProgrammeId={selectedProgrammeId}
                    userContext={{ ...userContext, selectedPersonaId }}
                    selectedPersonaId={selectedPersonaId}
                    onActivateNode={handleMapNodeSelect}
                    onAiFocusChange={setAiFocus}
                  />
                </div>
              </aside>
            </div>
            {navPinnable && <div className="h-12 shrink-0" aria-hidden />}

            <MobileDrawer
              open={mobileDrawerOpen}
              onClose={handleCloseDrawer}
            >
              <div className="flex flex-col">
                <div className="flex-shrink-0 border-b border-gray-200 p-3">
                  <NavigatorControls
                    onRoleChange={handleNavigatorRoleChange}
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
                    onClose={handleCloseDrawer}
                    onActivateNode={handleMapNodeSelect}
                    onAiFocusChange={setAiFocus}
                  />
                </div>
              </div>
            </MobileDrawer>
          </div>
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
