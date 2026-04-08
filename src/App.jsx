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
import { getRelevantNodes, personas, mapContextualSentences } from "./data/contentModel";

function App() {
  const navigatorRef = useRef(null);
  const intentSectionRef = useRef(null);
  const orientationRef = useRef(null);

  const [leaderMode, setLeaderMode] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("30 minutes");
  const [aiFocus, setAiFocus] = useState(null);

  const highlightedNodeIds = useMemo(
    () => (userContext ? getRelevantNodes({ ...userContext, selectedPersonaId }) : []),
    [selectedPersonaId, userContext]
  );

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

  const handleShowOptions = useCallback((currentRoleId, acceleration = false) => {
    const newContext = { currentRoleId, acceleration };
    setUserContext(newContext);
    setSelectedNodeId(currentRoleId);
    setSelectedStoryId(null);
    setSelectedProgrammeId(null);
    setMobileDrawerOpen(true);
  }, []);

  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setSelectedStoryId(null);
    setSelectedProgrammeId(null);
    setMobileDrawerOpen(true);
  };

  const handleSelectStory = (storyId) => {
    setSelectedStoryId(storyId);
    setSelectedNodeId(null);
    setSelectedProgrammeId(null);
    setMobileDrawerOpen(true);
  };

  const handleSelectProgramme = (programmeId) => {
    setSelectedProgrammeId(programmeId);
    setSelectedNodeId(null);
    setSelectedStoryId(null);
    setMobileDrawerOpen(true);
  };

  const handleOpenDrawer = () => setMobileDrawerOpen(true);

  const handleCloseDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50 text-gray-800">
      <Header />

      <main className="min-w-0 flex-1">
        <HeroVideoSection
          onStartExploring={handleStartExploring}
          onLeaderMode={handleLeaderMode}
        />

        <section ref={intentSectionRef} aria-label="Choose your intent">
          <IntentSelector onSelectIntent={handleSelectIntent} />
        </section>

        <div ref={orientationRef}>
          <Container>
            <IntroSection />
          </Container>
        </div>

        <Container>
          <SellingPointsGrid />
        </Container>

        <section
          ref={navigatorRef}
          id="growth-navigator"
          className="flex min-h-screen w-full min-w-0 flex-col border-t border-gray-300 bg-gray-100 px-3 pt-3 pb-3 pr-4 md:px-4 md:pt-4 md:pb-4 md:pr-6"
        >
          <div className="mx-auto flex h-full min-h-0 w-full max-w-full flex-1 flex-col overflow-hidden rounded-xl border-4 border-gray-300 bg-gray-100 p-3 md:max-w-[1800px] md:flex-row md:p-4">
            <aside className="hidden md:flex md:min-h-full md:w-96 md:flex-shrink-0 md:flex-col md:overflow-hidden md:rounded-xl md:border-4 md:border-gray-300 md:bg-white md:shadow-sm">
              <div className="min-h-0 flex-1 overflow-auto p-4">
                <RoutePanel
                  selectedNodeId={selectedNodeId}
                  selectedStoryId={selectedStoryId}
                  selectedProgrammeId={selectedProgrammeId}
                  userContext={{ ...userContext, selectedPersonaId }}
                  selectedPersonaId={selectedPersonaId}
                  leaderMode={leaderMode}
                  onAiFocusChange={setAiFocus}
                />
              </div>
            </aside>

            <div className="relative flex min-h-[300px] min-w-0 flex-1 flex-col md:min-h-0">
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
              {userContext && (
                <>
                  <div className="flex-shrink-0 border-b border-gray-300 bg-white px-4 py-2">
                    <p className="text-sm font-medium text-gray-800">
                      {userContext?.acceleration
                        ? mapContextualSentences.accelerationPath
                        : mapContextualSentences.defaultPath}
                    </p>
                  </div>
                </>
              )}
              <div className="relative min-h-[280px] min-w-0 flex-1 md:min-h-0 md:rounded-r-xl">
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
                  selectedNodeId={selectedNodeId}
                  onSelectNode={handleSelectNode}
                  onShowOptions={handleShowOptions}
                  onSelectStory={handleSelectStory}
                  onSelectProgramme={handleSelectProgramme}
                  openDrawer={handleOpenDrawer}
                  selectedPersonaId={selectedPersonaId}
                  onSelectPersona={setSelectedPersonaId}
                  PersonaQualifierComponent={PersonaQualifier}
                  aiFocus={aiFocus}
                />
              </div>
            </div>
          </div>

          <MobileDrawer
            open={mobileDrawerOpen}
            onClose={handleCloseDrawer}
          >
            <div className="flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-200 p-3">
                <NavigatorControls
                  onShowOptions={handleShowOptions}
                  timeFilter={timeFilter}
                  onTimeFilterChange={setTimeFilter}
                  userContext={userContext}
                />
              </div>
              <div className="flex-1 overflow-auto p-4">
                <RoutePanel
                  selectedNodeId={selectedNodeId}
                  selectedStoryId={selectedStoryId}
                  selectedProgrammeId={selectedProgrammeId}
                  userContext={{ ...userContext, selectedPersonaId }}
                  selectedPersonaId={selectedPersonaId}
                  leaderMode={leaderMode}
                  onClose={handleCloseDrawer}
                  onAiFocusChange={setAiFocus}
                />
              </div>
            </div>
          </MobileDrawer>
        </section>

        <ManagerSupportSection />

        <FAQSection />

        <Footer />
      </main>
    </div>
  );
}

export default App;
