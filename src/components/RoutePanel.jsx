import { useEffect, useState } from "react";
import {
  ADVANCED_CONVERSATION_PROMPT_IDS,
  buildDevelopmentCase,
  getAdvancedConversationGuidance,
  getCoreJourneyForRole,
  getDiplomaForRole,
  getNextRoleById,
  getNodeContext,
  getProgrammeById,
  getRoleById,
  getStoryById,
  overviewLead,
  programmeRelevanceLine,
  roles,
} from "../data/contentModel";

const CARD_CLASS =
  "rounded-lg border border-gray-300 bg-white p-4 shadow-sm";
const DETAIL_BLOCK_CLASS = "rounded-lg border border-gray-200 bg-gray-50 p-3";

function isSidebarNodeActive(
  nodeId,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
  kind,
) {
  const activeId = selectedProgrammeId || selectedNodeId;
  if (activeId !== nodeId) return false;
  if (kind === "role") return selectedNodeType === "role";
  if (kind === "core") return selectedNodeType === "core";
  if (kind === "advanced") return selectedNodeType === "advanced";
  return false;
}

function MapNavButton({
  label,
  nodeId,
  isActive,
  onActivate,
  title,
  variant = "default",
}) {
  const isDiploma = variant === "diploma";
  return (
    <button
      type="button"
      title={title ?? label}
      onClick={() => onActivate?.(nodeId)}
      className={`w-full rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        isActive
          ? isDiploma
            ? "border-blue-900 bg-blue-900 text-white shadow-sm"
            : "border-gray-800 bg-gray-800 text-white shadow-sm"
          : isDiploma
            ? "border-blue-600 bg-blue-50 text-blue-950 hover:border-blue-700 hover:bg-blue-100"
            : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function RelatedOptionsFooter({ onActivateNode, children }) {
  if (!onActivateNode) return null;
  return (
    <div className="border-t border-gray-200 pt-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        Related options
      </p>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

const PRIMARY_CTA_CLASS =
  "w-full rounded-md border border-gray-900 bg-gray-900 px-3 py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-gray-800";
const ADVANCED_PRIMARY_CTA_CLASS =
  "w-full rounded-md border border-blue-900 bg-blue-900 px-3 py-2.5 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-800";

const ADVANCED_AI_CLASS =
  "rounded-lg border border-dashed border-blue-700/70 bg-blue-50/50 px-3 py-3";

const QUOTE_EXCERPT_MAX = 140;

function quoteExcerpt(quote, max = QUOTE_EXCERPT_MAX) {
  if (!quote) return "";
  const t = quote.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function AdvancedAiSupportBlock({
  developmentCase,
  onGenerateCase,
  advancedGuidanceBlurb,
  onSelectPrompt,
}) {
  return (
    <div id="advanced-ai" className={ADVANCED_AI_CLASS}>
      <p className="text-sm font-semibold text-blue-950">
        Prepare for your manager conversation
      </p>
      <button
        id="generate-case"
        type="button"
        onClick={onGenerateCase}
        className="mt-3 w-full rounded border border-blue-900 bg-blue-900 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
      >
        Generate your case
      </button>
      <div className="mt-3 flex flex-col gap-2 border-t border-blue-200/80 pt-3">
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.ready)
          }
          className="text-left text-sm font-medium text-blue-900 underline decoration-blue-900/30 underline-offset-2 hover:text-blue-950"
        >
          Am I ready for this?
        </button>
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.focus)
          }
          className="text-left text-sm font-medium text-blue-900 underline decoration-blue-900/30 underline-offset-2 hover:text-blue-950"
        >
          What should I focus on next?
        </button>
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.explain)
          }
          className="text-left text-sm font-medium text-blue-900 underline decoration-blue-900/30 underline-offset-2 hover:text-blue-950"
        >
          How do I explain this to my manager?
        </button>
      </div>
      {advancedGuidanceBlurb ? (
        <p className="mt-3 border-t border-blue-200/80 pt-3 text-sm leading-relaxed text-gray-800">
          {advancedGuidanceBlurb}
        </p>
      ) : null}
      {developmentCase ? (
        <div
          id="ai-output"
          className="mt-4 border-t border-blue-200/80 pt-4"
        >
          <p className="text-sm font-semibold text-gray-900">
            Your development case
          </p>
          <div className="mt-3 space-y-4 text-sm text-gray-800">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Current position
              </p>
              <p className="mt-1 leading-relaxed">
                {developmentCase.currentPosition}
              </p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Next step
              </p>
              <p className="mt-1 leading-relaxed">{developmentCase.nextStep}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Why this programme fits
              </p>
              <p className="mt-1 leading-relaxed">{developmentCase.whyFits}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                What you will gain
              </p>
              <ul className="mt-1 list-inside list-disc space-y-1 leading-relaxed">
                {developmentCase.whatYouGain.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getGeneralManagerLine() {
  return {
    title: "General Manager",
    body: "Leadership at this level shows in how you grow your team and the business day to day.",
  };
}

function RoleOverviewPanel({
  roleId,
  onClose,
  onActivateNode,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
}) {
  const role = getRoleById(roleId);
  if (!role) return null;
  const nextRole = getNextRoleById(role.id);
  const journeyId = getCoreJourneyForRole(role.id);
  const diplomaId = getDiplomaForRole(role.id);
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;
  const gmLine = role.id === "general_manager" ? getGeneralManagerLine() : null;

  return (
    <div className={`flex flex-col gap-4 ${CARD_CLASS}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-sm text-gray-600 underline"
        >
          Close
        </button>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Your current level
        </p>
        <h3 className="mt-1 text-xl font-semibold text-gray-900">{role.label}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {gmLine ? gmLine.body : overviewLead(role.overview)}
        </p>
      </div>

      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Available next steps
        </p>
        {nextRole ? (
          <p className="mt-2 text-sm font-medium text-gray-900">{nextRole.label}</p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Continue growing through property and regional leadership opportunities.
          </p>
        )}
      </div>

      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Suggested learning options
        </p>
        <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-gray-800">
          {journeyProg && <li>{journeyProg.title} — core pathway toward your next role.</li>}
          {diplomaProg && (
            <li>
              {diplomaProg.title} — optional value-add qualification (tap the map to
              explore).
            </li>
          )}
          {!journeyProg && !diplomaProg && (
            <li>Browse IHG University for learning that matches your goals.</li>
          )}
        </ul>
      </div>

      {onActivateNode && (journeyProg || diplomaProg) ? (
        <RelatedOptionsFooter onActivateNode={onActivateNode}>
          {journeyProg && (
            <MapNavButton
              label={journeyProg.title}
              nodeId={journeyProg.id}
              isActive={isSidebarNodeActive(
                journeyProg.id,
                selectedNodeId,
                selectedProgrammeId,
                selectedNodeType,
                "core",
              )}
              onActivate={onActivateNode}
            />
          )}
          {diplomaProg && (
            <MapNavButton
              variant="diploma"
              label={diplomaProg.title}
              nodeId={diplomaProg.id}
              isActive={isSidebarNodeActive(
                diplomaProg.id,
                selectedNodeId,
                selectedProgrammeId,
                selectedNodeType,
                "advanced",
              )}
              onActivate={onActivateNode}
            />
          )}
        </RelatedOptionsFooter>
      ) : null}
    </div>
  );
}

function CoreProgrammePanel({
  programme,
  onClose,
  userContext,
  onActivateNode,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
}) {
  const anchorId = userContext?.currentRoleId ?? null;
  const diplomaId = anchorId ? getDiplomaForRole(anchorId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;
  const leadsTo = programme.leadsTo?.trim();

  return (
    <div className={`flex flex-col gap-4 ${CARD_CLASS}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-sm text-gray-600 underline"
        >
          Close
        </button>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Core programme
        </p>
        <h3 className="mt-1 text-xl font-semibold text-gray-900">{programme.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {programmeRelevanceLine(programme)}
        </p>
      </div>

      <button
        type="button"
        className={PRIMARY_CTA_CLASS}
        onClick={() =>
          document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Start now
      </button>

      <div className={`space-y-3 text-sm text-gray-800 ${DETAIL_BLOCK_CLASS}`}>
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Who it&apos;s for
          </p>
          <p className="mt-1 leading-relaxed">{programme.whoItsFor}</p>
        </section>
        {leadsTo ? (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              What it leads to
            </p>
            <p className="mt-1 leading-relaxed">{leadsTo}</p>
          </section>
        ) : null}
      </div>

      <details className="rounded-md border border-gray-200 bg-gray-50/90">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-gray-700 marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="underline decoration-gray-400 underline-offset-2">
            More detail
          </span>
        </summary>
        <div className="space-y-3 border-t border-gray-200 px-3 pb-3 pt-3 text-sm text-gray-800">
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Skills developed
            </p>
            <p className="mt-1 leading-relaxed">{programme.skillsDeveloped}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              What to expect
            </p>
            <p className="mt-1 leading-relaxed">{programme.whatToExpect}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Time commitment
            </p>
            <p className="mt-1 leading-relaxed">{programme.timeCommitment}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Next step
            </p>
            <p className="mt-1 leading-relaxed">{programme.nextStep}</p>
          </section>
        </div>
      </details>

      {onActivateNode ? (
        <RelatedOptionsFooter onActivateNode={onActivateNode}>
          <MapNavButton
            label={programme.title}
            nodeId={programme.id}
            isActive={isSidebarNodeActive(
              programme.id,
              selectedNodeId,
              selectedProgrammeId,
              selectedNodeType,
              "core",
            )}
            onActivate={onActivateNode}
          />
          {diplomaProg && (
            <MapNavButton
              variant="diploma"
              label={diplomaProg.title}
              nodeId={diplomaProg.id}
              isActive={isSidebarNodeActive(
                diplomaProg.id,
                selectedNodeId,
                selectedProgrammeId,
                selectedNodeType,
                "advanced",
              )}
              onActivate={onActivateNode}
            />
          )}
        </RelatedOptionsFooter>
      ) : null}
    </div>
  );
}

function AdvancedProgrammePanel({
  programme,
  nodeContext,
  onClose,
  userContext,
  selectedPersonaId,
  onActivateNode,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
}) {
  const [quoteExpanded, setQuoteExpanded] = useState(false);
  const [developmentCase, setDevelopmentCase] = useState(null);
  const [advancedGuidanceBlurb, setAdvancedGuidanceBlurb] = useState("");

  useEffect(() => {
    setQuoteExpanded(false);
    setDevelopmentCase(null);
    setAdvancedGuidanceBlurb("");
  }, [programme.id]);

  const fullQuote = nodeContext.quote?.trim() ?? "";
  const excerpt = fullQuote ? quoteExcerpt(fullQuote) : "";
  const quoteNeedsToggle = fullQuote.length > excerpt.length;
  const quoteDisplay =
    quoteExpanded || !quoteNeedsToggle ? fullQuote : excerpt;
  const avatarSrc = nodeContext.quoteAuthor
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(nodeContext.quoteAuthor)}&size=112&background=e5e7eb&color=374151`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent("Colleague")}&size=112&background=e5e7eb&color=374151`;

  const anchorId = userContext?.currentRoleId ?? null;
  const journeyId = anchorId ? getCoreJourneyForRole(anchorId) : null;
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const leadsTo = programme.leadsTo?.trim();

  return (
    <div className={`flex flex-col gap-4 ${CARD_CLASS}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="self-end text-sm text-gray-600 underline"
        >
          Close
        </button>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Value-add programme
        </p>
        <h3 className="mt-1 text-xl font-semibold text-gray-900">{programme.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {programmeRelevanceLine(programme)}
        </p>
      </div>

      <div className={`space-y-3 text-sm text-gray-800 ${DETAIL_BLOCK_CLASS}`}>
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Who it&apos;s for
          </p>
          <p className="mt-1 leading-relaxed">{programme.whoItsFor}</p>
        </section>
        {leadsTo ? (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              What it leads to
            </p>
            <p className="mt-1 leading-relaxed">{leadsTo}</p>
          </section>
        ) : null}
      </div>

      <details className="rounded-md border border-gray-200 bg-gray-50/90">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-gray-700 marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="underline decoration-gray-400 underline-offset-2">
            More detail
          </span>
        </summary>
        <div className="space-y-3 border-t border-gray-200 px-3 pb-3 pt-3 text-sm text-gray-800">
          {nodeContext.whyChooseThis ? (
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Why choose this
              </p>
              <p className="mt-1 leading-relaxed">{nodeContext.whyChooseThis}</p>
            </section>
          ) : null}
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              What to expect
            </p>
            <p className="mt-1 leading-relaxed">{programme.whatToExpect}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Time commitment
            </p>
            <p className="mt-1 leading-relaxed">{programme.timeCommitment}</p>
          </section>
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Next step
            </p>
            <p className="mt-1 leading-relaxed">{programme.nextStep}</p>
          </section>
        </div>
      </details>

      {fullQuote ? (
        <div className="flex gap-3 rounded-lg border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50 p-3">
          <img
            src={avatarSrc}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
            width={56}
            height={56}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-gray-800">
              &ldquo;{quoteDisplay}&rdquo;
            </p>
            {quoteNeedsToggle && (
              <button
                type="button"
                onClick={() => setQuoteExpanded((v) => !v)}
                className="mt-2 text-sm font-medium text-blue-800 underline decoration-blue-800/40 underline-offset-2 hover:text-blue-900"
              >
                {quoteExpanded ? "Read less" : "Read more"}
              </button>
            )}
            {nodeContext.quoteAuthor && (
              <p className="mt-2 text-xs font-medium text-gray-600">
                — {nodeContext.quoteAuthor}
              </p>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className={ADVANCED_PRIMARY_CTA_CLASS}
        onClick={() =>
          document
            .getElementById("advanced-ai")
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
      >
        Discuss with manager
      </button>

      <div className="rounded-lg border border-dashed border-blue-700/80 bg-blue-50/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-900/80">
          Recommended for progression
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-800">
          Enrolment and timing vary by market. Your manager or L&D contact can help
          you align this with your development plan and property priorities.
        </p>
      </div>

      <AdvancedAiSupportBlock
        developmentCase={developmentCase}
        onGenerateCase={() => {
          setAdvancedGuidanceBlurb("");
          setDevelopmentCase(
            buildDevelopmentCase({
              programme,
              currentRoleId: userContext?.currentRoleId,
              selectedPersonaId:
                userContext?.selectedPersonaId ?? selectedPersonaId,
            }),
          );
        }}
        advancedGuidanceBlurb={advancedGuidanceBlurb}
        onSelectPrompt={(promptId) => {
          setAdvancedGuidanceBlurb(
            getAdvancedConversationGuidance(promptId, programme),
          );
        }}
      />

      {onActivateNode ? (
        <RelatedOptionsFooter onActivateNode={onActivateNode}>
          <MapNavButton
            variant="diploma"
            label={programme.title}
            nodeId={programme.id}
            isActive={isSidebarNodeActive(
              programme.id,
              selectedNodeId,
              selectedProgrammeId,
              selectedNodeType,
              "advanced",
            )}
            onActivate={onActivateNode}
          />
          {journeyProg && (
            <MapNavButton
              label={journeyProg.title}
              nodeId={journeyProg.id}
              isActive={isSidebarNodeActive(
                journeyProg.id,
                selectedNodeId,
                selectedProgrammeId,
                selectedNodeType,
                "core",
              )}
              onActivate={onActivateNode}
            />
          )}
        </RelatedOptionsFooter>
      ) : null}
    </div>
  );
}

export default function RoutePanel({
  selectedNodeId,
  selectedNodeType,
  mapInteractionState: _mapInteractionState,
  selectedStoryId,
  selectedProgrammeId,
  userContext,
  selectedPersonaId,
  leaderMode: _leaderMode,
  onClose,
  onActivateNode,
  onAiFocusChange: _onAiFocusChange,
}) {
  const activeNodeId = selectedProgrammeId || selectedNodeId;
  const activeProgramme = activeNodeId
    ? getProgrammeById(activeNodeId)
    : null;
  const activeRole = activeNodeId ? getRoleById(activeNodeId) : null;

  const effectiveType =
    selectedNodeType ??
    (activeProgramme
      ? activeProgramme.type === "advanced"
        ? "advanced"
        : "core"
      : activeRole
        ? "role"
        : null);

  if (selectedStoryId) {
    const story = getStoryById(selectedStoryId);
    if (!story)
      return (
        <EmptyPanel
          onClose={onClose}
          userContext={userContext}
          onActivateNode={onActivateNode}
          selectedNodeId={selectedNodeId}
          selectedProgrammeId={selectedProgrammeId}
          selectedNodeType={selectedNodeType}
        />
      );
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

  if (activeRole && effectiveType === "role") {
    return (
      <RoleOverviewPanel
        roleId={activeRole.id}
        onClose={onClose}
        onActivateNode={onActivateNode}
        selectedNodeId={selectedNodeId}
        selectedProgrammeId={selectedProgrammeId}
        selectedNodeType={selectedNodeType}
      />
    );
  }

  if (activeProgramme && effectiveType === "core") {
    return (
      <CoreProgrammePanel
        programme={activeProgramme}
        onClose={onClose}
        userContext={userContext}
        onActivateNode={onActivateNode}
        selectedNodeId={selectedNodeId}
        selectedProgrammeId={selectedProgrammeId}
        selectedNodeType={selectedNodeType}
      />
    );
  }

  if (activeProgramme && effectiveType === "advanced") {
    const nodeContext = getNodeContext(activeNodeId);
    if (!nodeContext)
      return (
        <EmptyPanel
          onClose={onClose}
          userContext={userContext}
          onActivateNode={onActivateNode}
          selectedNodeId={selectedNodeId}
          selectedProgrammeId={selectedProgrammeId}
          selectedNodeType={selectedNodeType}
        />
      );
    return (
      <AdvancedProgrammePanel
        programme={activeProgramme}
        nodeContext={nodeContext}
        onClose={onClose}
        userContext={userContext}
        selectedPersonaId={selectedPersonaId}
        onActivateNode={onActivateNode}
        selectedNodeId={selectedNodeId}
        selectedProgrammeId={selectedProgrammeId}
        selectedNodeType={selectedNodeType}
      />
    );
  }

  return (
    <EmptyPanel
      onClose={onClose}
      userContext={userContext}
      onActivateNode={onActivateNode}
      selectedNodeId={selectedNodeId}
      selectedProgrammeId={selectedProgrammeId}
      selectedNodeType={selectedNodeType}
    />
  );
}

function EmptyPanel({
  onClose,
  userContext,
  onActivateNode,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
}) {
  const anchorRoleId = userContext?.currentRoleId ?? null;
  const journeyId = anchorRoleId ? getCoreJourneyForRole(anchorRoleId) : null;
  const diplomaId = anchorRoleId ? getDiplomaForRole(anchorRoleId) : null;
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;

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
      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-sm text-gray-600">
          {anchorRoleId
            ? "Open a progress path below, or choose a different role from the map or filters."
            : "Pick your hotel role below to see progress options, or use the map or filters."}
        </p>
      </div>
      {onActivateNode && (
        <>
          {!anchorRoleId ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-800">Related options</p>
              <div className="flex flex-col gap-2">
                {roles.map((r) => (
                  <MapNavButton
                    key={r.id}
                    nodeId={r.id}
                    label={r.label}
                    isActive={isSidebarNodeActive(
                      r.id,
                      selectedNodeId,
                      selectedProgrammeId,
                      selectedNodeType,
                      "role",
                    )}
                    onActivate={onActivateNode}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {(journeyProg || diplomaProg) && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-800">
                    Related options
                  </p>
                  <div className="flex flex-col gap-2">
                    {journeyProg && (
                      <MapNavButton
                        nodeId={journeyProg.id}
                        label={journeyProg.title}
                        isActive={isSidebarNodeActive(
                          journeyProg.id,
                          selectedNodeId,
                          selectedProgrammeId,
                          selectedNodeType,
                          "core",
                        )}
                        onActivate={onActivateNode}
                      />
                    )}
                    {diplomaProg && (
                      <MapNavButton
                        variant="diploma"
                        nodeId={diplomaProg.id}
                        label={diplomaProg.title}
                        isActive={isSidebarNodeActive(
                          diplomaProg.id,
                          selectedNodeId,
                          selectedProgrammeId,
                          selectedNodeType,
                          "advanced",
                        )}
                        onActivate={onActivateNode}
                      />
                    )}
                  </div>
                </div>
              )}
              <details className="rounded-md border border-gray-200 bg-gray-50/90">
                <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-gray-700 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="underline decoration-gray-400 underline-offset-2">
                    Choose a different role
                  </span>
                </summary>
                <div className="flex flex-col gap-2 border-t border-gray-200 px-3 pb-3 pt-2">
                  {roles
                    .filter((r) => r.id !== anchorRoleId)
                    .map((r) => (
                      <MapNavButton
                        key={r.id}
                        nodeId={r.id}
                        label={r.label}
                        isActive={isSidebarNodeActive(
                          r.id,
                          selectedNodeId,
                          selectedProgrammeId,
                          selectedNodeType,
                          "role",
                        )}
                        onActivate={onActivateNode}
                      />
                    ))}
                </div>
              </details>
            </>
          )}
        </>
      )}
    </div>
  );
}
