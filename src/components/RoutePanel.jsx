import { useState } from "react";
import {
  getStoryById,
  getNodeContext,
  getNextRoleById,
  pathAiConfig,
  roles,
} from "../data/contentModel";
import { askPathAi } from "../data/pathAi";

const CARD_CLASS =
  "rounded-lg border border-gray-300 bg-white p-4 shadow-sm";
const DETAIL_BLOCK_CLASS = "rounded-lg border border-gray-200 bg-gray-50 p-3";

function getJourneySummary(userContext) {
  if (!userContext?.currentRoleId) return null;

  const currentRole = roles.find((r) => r.id === userContext.currentRoleId);
  if (!currentRole) return null;

  const nextRole = getNextRoleById(currentRole.id);
  const routeLine = nextRole
    ? `From ${currentRole.label} to ${nextRole.label}`
    : `From ${currentRole.label} onward`;

  if (userContext.acceleration) {
    return {
      title: "Your accelerated path",
      body: "You are combining applied experience with structured learning. This strengthens your decision-making and reduces the need for correction.",
      subtext:
        "You still move through the same journey, with greater clarity and fewer setbacks.",
      routeLine,
    };
  }

  return {
    title: "Your progression path",
    body: "You move forward through applied experience at your current level. Each step builds the behaviours required for the next role.",
    subtext: "Progression happens through practice, feedback, and repetition.",
    routeLine,
  };
}

function getGeneralManagerJourneyStory(userContext) {
  if (!userContext?.currentRoleId) return null;
  const currentRole = roles.find((r) => r.id === userContext.currentRoleId);
  if (!currentRole) return null;

  return {
    title: "Final stage: General Manager",
    body: "This role reflects full alignment of experience and understanding. Progression is no longer structured - it is expressed through leadership itself.",
  };
}

export default function RoutePanel({
  selectedNodeId,
  selectedStoryId,
  selectedProgrammeId,
  userContext,
  selectedPersonaId: _selectedPersonaId,
  leaderMode: _leaderMode,
  onClose,
  onAiFocusChange,
}) {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [showRoleDetails, setShowRoleDetails] = useState(false);

  if (selectedStoryId) {
    const story = getStoryById(selectedStoryId);
    if (!story) return <EmptyPanel onClose={onClose} />;
    const imgSrc = `https://placehold.co/400x200/e8e8e8/525252?text=${encodeURIComponent(story.name)}`;
    return (
      <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end text-sm text-gray-600 underline"
          >
            Close
          </button>
        )}
        <img
          src={imgSrc}
          alt=""
          className="w-full rounded-md object-cover"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-800">{story.name}</h3>
          <p className="text-sm text-gray-600">{story.pathDescription}</p>
          <div className={DETAIL_BLOCK_CLASS}>
            <p className="text-sm text-gray-700">{story.shortStory}</p>
          </div>
        </div>
      </div>
    );
  }

  const activeNodeId = selectedProgrammeId || selectedNodeId;
  const nodeContext = activeNodeId ? getNodeContext(activeNodeId, userContext) : null;
  const journeySummary = getJourneySummary(userContext);
  const isGeneralManagerNode = activeNodeId === "general_manager";
  const isDiplomaNode = Boolean(activeNodeId?.startsWith("hospitality_diploma"));
  const isJourneyNode = Boolean(activeNodeId?.startsWith("journey_"));
  const runPathAi = ({ question = "", isReadinessCheck = false } = {}) => {
    const result = askPathAi({
      userContext,
      selectedNodeId: activeNodeId,
      question,
      isReadinessCheck,
    });
    setAiResponse(result.answer);
    onAiFocusChange?.(result.focus);
  };

  if (nodeContext) {
    const isRole = nodeContext.type === "role";
    const orientationTitle = nodeContext.title;
    const orientation = isGeneralManagerNode
      ? getGeneralManagerJourneyStory(userContext)
      : isDiplomaNode
        ? {
            title: "Your progression path",
            body: "You move forward through applied experience. Each step builds the behaviours required for the next role.",
            routeLine: journeySummary?.routeLine,
          }
        : isJourneyNode
          ? {
              title: "Your progression path",
              body: "You move forward through applied experience. Each step builds the behaviours required for the next role.",
              routeLine: journeySummary?.routeLine,
            }
          : {
              title: "Your progression path",
              body: "You move forward through applied experience. Each step builds the behaviours required for the next role.",
              routeLine: journeySummary?.routeLine,
            };

    return (
      <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end text-sm text-gray-600 underline"
          >
            Close
          </button>
        )}
        <h3 className="text-lg font-medium text-gray-800">{orientationTitle}</h3>
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">{orientation.title}</p>
          <p className="mt-0.5 text-sm text-gray-700">{orientation.body}</p>
          {orientation.routeLine && (
            <p className="mt-1 text-xs font-medium text-gray-700">{orientation.routeLine}</p>
          )}
        </div>

        <PathAiSection
          userContext={userContext}
          aiQuestion={aiQuestion}
          aiResponse={aiResponse}
          onQuestionChange={setAiQuestion}
          onSubmitQuestion={() => runPathAi({ question: aiQuestion })}
          onSubmitQuickPrompt={(question) => {
            setAiQuestion(question);
            runPathAi({
              question,
              isReadinessCheck: question.toLowerCase().includes("ready"),
            });
          }}
        />

        <button
          type="button"
          onClick={() => setShowRoleDetails((value) => !value)}
          className="self-start text-sm font-medium text-gray-700 underline"
        >
          {showRoleDetails ? "Hide role details" : "+ Role details"}
        </button>
        {showRoleDetails && (
          <div className={`${DETAIL_BLOCK_CLASS} space-y-2`}>
            {isRole && nodeContext.quote && (
              <blockquote className="border-l-4 border-gray-400 pl-3 italic text-gray-700">
                <p className="text-sm">"{nodeContext.quote}"</p>
                {nodeContext.quoteAuthor && (
                  <cite className="mt-1 block text-xs not-italic text-gray-600">
                    — {nodeContext.quoteAuthor}
                  </cite>
                )}
              </blockquote>
            )}
            <div>
              <p className="text-xs font-medium text-gray-600">Who it's for</p>
              <p className="mt-0.5 text-sm text-gray-700">{nodeContext.whoItsFor}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">What it helps with</p>
              <p className="mt-0.5 text-sm text-gray-700">{nodeContext.whatItHelpsWith}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">What it leads to</p>
              <p className="mt-0.5 text-sm text-gray-700">{nodeContext.whatItLeadsTo}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <EmptyPanel
      onClose={onClose}
      journeySummary={journeySummary}
      userContext={userContext}
      aiQuestion={aiQuestion}
      aiResponse={aiResponse}
      onQuestionChange={setAiQuestion}
      onSubmitQuestion={() => runPathAi({ question: aiQuestion })}
      onSubmitQuickPrompt={(question) => {
        setAiQuestion(question);
        runPathAi({
          question,
          isReadinessCheck: question.toLowerCase().includes("ready"),
        });
      }}
    />
  );
}

function PathAiSection({
  userContext,
  aiQuestion,
  aiResponse,
  onQuestionChange,
  onSubmitQuestion,
  onSubmitQuickPrompt,
}) {
  const isReady = Boolean(userContext?.currentRoleId);

  return (
    <div className={DETAIL_BLOCK_CLASS}>
      <p className="text-xs font-medium text-gray-600">{pathAiConfig.sectionTitle}</p>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={aiQuestion}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder={pathAiConfig.inputPlaceholder}
          className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm text-gray-700"
          disabled={!isReady}
        />
        <button
          type="button"
          onClick={onSubmitQuestion}
          disabled={!isReady || !aiQuestion.trim()}
          className="rounded border border-gray-700 bg-gray-800 px-2 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Ask
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {pathAiConfig.quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSubmitQuickPrompt(prompt)}
            disabled={!isReady}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {!isReady && (
        <p className="mt-2 text-xs text-gray-600">
          Choose your current role to ask about this path.
        </p>
      )}
      {aiResponse && <p className="mt-2 whitespace-pre-line text-sm text-gray-800">{aiResponse}</p>}
    </div>
  );
}

function EmptyPanel({
  onClose,
  journeySummary,
  userContext,
  aiQuestion,
  aiResponse,
  onQuestionChange,
  onSubmitQuestion,
  onSubmitQuickPrompt,
}) {
  return (
    <div className={`flex flex-col gap-3 ${CARD_CLASS}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-sm text-gray-600 underline"
        >
          Close
        </button>
      )}
      {journeySummary ? (
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-xs font-medium text-gray-600">{journeySummary.title}</p>
          <p className="mt-0.5 text-sm text-gray-700">{journeySummary.body}</p>
          <p className="mt-1 text-xs font-medium text-gray-700">{journeySummary.routeLine}</p>
        </div>
      ) : (
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-sm text-gray-600">
            Select a node on the map, a story pin, or a programme card to see
            details here.
          </p>
        </div>
      )}
      <PathAiSection
        userContext={userContext}
        aiQuestion={aiQuestion}
        aiResponse={aiResponse}
        onQuestionChange={onQuestionChange}
        onSubmitQuestion={onSubmitQuestion}
        onSubmitQuickPrompt={onSubmitQuickPrompt}
      />
    </div>
  );
}
