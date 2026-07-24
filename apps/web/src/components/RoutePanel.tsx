import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BedDouble, Compass, Footprints, GraduationCap } from "lucide-react";
import PanelShell, { heroForId } from "./PanelShell";
import type {
  DevelopmentCase,
  NodeContext,
  NodeType,
  Programme,
} from "../types/content";
import type { MapInteractionState, NavigatorUserContext } from "../types/ui";
import type { PathAiFocus } from "../data/pathAi";
import { useT } from "../content/ContentProvider";
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

const DETAIL_BLOCK_CLASS = "rounded-lg border bg-muted/40 p-3";

/** Selection state threaded from App into every panel variant. */
interface SidebarSelection {
  selectedNodeId?: string | null;
  selectedProgrammeId?: string | null;
  selectedNodeType?: NodeType | null;
}

type ActivateNode = (nodeId: string) => void;

function isSidebarNodeActive(
  nodeId: string,
  selectedNodeId: string | null | undefined,
  selectedProgrammeId: string | null | undefined,
  selectedNodeType: NodeType | null | undefined,
  kind: NodeType,
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
}: {
  label: string;
  nodeId: string;
  isActive?: boolean;
  onActivate?: ActivateNode;
  title?: string;
  variant?: "default" | "diploma";
}) {
  const isDiploma = variant === "diploma";
  return (
    <button
      type="button"
      title={title ?? label}
      onClick={() => onActivate?.(nodeId)}
      className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        isActive
          ? isDiploma
            ? "border-orange-700 bg-orange-700 text-white shadow-sm"
            : "border-primary bg-primary text-primary-foreground shadow-sm"
          : isDiploma
            ? "border-orange-600/60 bg-orange-50 text-orange-950 hover:border-orange-700 hover:bg-orange-100"
            : "border-border bg-card text-foreground hover:border-ring hover:bg-muted/60"
      }`}
    >
      {label}
    </button>
  );
}

function RelatedOptionsFooter({
  onActivateNode,
  children,
}: {
  onActivateNode?: ActivateNode | null;
  children: ReactNode;
}) {
  const t = useT();
  if (!onActivateNode) return null;
  return (
    <div className="border-t border-border pt-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {t("panel.related")}
      </p>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

const PRIMARY_CTA_CLASS =
  "w-full rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
const ADVANCED_PRIMARY_CTA_CLASS =
  "w-full rounded-lg bg-orange-700 px-3 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-800";

const ADVANCED_AI_CLASS =
  "rounded-lg border border-dashed border-orange-700/70 bg-orange-50/50 px-3 py-3";

const QUOTE_EXCERPT_MAX = 140;

function quoteExcerpt(
  quote: string | null | undefined,
  max = QUOTE_EXCERPT_MAX,
) {
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
}: {
  developmentCase: DevelopmentCase | null;
  onGenerateCase: () => void;
  advancedGuidanceBlurb: string;
  onSelectPrompt: (promptId: string) => void;
}) {
  return (
    <div id="advanced-ai" className={ADVANCED_AI_CLASS}>
      <p className="text-sm font-semibold text-orange-950">
        Prepare for your manager conversation
      </p>
      <button
        id="generate-case"
        type="button"
        onClick={onGenerateCase}
        className="mt-3 w-full rounded border border-orange-700 bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-800"
      >
        Generate your case
      </button>
      <div className="mt-3 flex flex-col gap-2 border-t border-orange-200/80 pt-3">
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.ready)
          }
          className="text-left text-sm font-medium text-orange-700 underline decoration-orange-700/30 underline-offset-2 hover:text-orange-950"
        >
          Am I ready for this?
        </button>
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.focus)
          }
          className="text-left text-sm font-medium text-orange-700 underline decoration-orange-700/30 underline-offset-2 hover:text-orange-950"
        >
          What should I focus on next?
        </button>
        <button
          type="button"
          onClick={() =>
            onSelectPrompt(ADVANCED_CONVERSATION_PROMPT_IDS.explain)
          }
          className="text-left text-sm font-medium text-orange-700 underline decoration-orange-700/30 underline-offset-2 hover:text-orange-950"
        >
          How do I explain this to my manager?
        </button>
      </div>
      {advancedGuidanceBlurb ? (
        <p className="mt-3 border-t border-orange-200/80 pt-3 text-sm leading-relaxed text-foreground">
          {advancedGuidanceBlurb}
        </p>
      ) : null}
      {developmentCase ? (
        <div
          id="ai-output"
          className="mt-4 border-t border-orange-200/80 pt-4"
        >
          <p className="text-sm font-semibold text-foreground">
            Your development case
          </p>
          <div className="mt-3 space-y-4 text-sm text-foreground">
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Current position
              </p>
              <p className="mt-1 leading-relaxed">
                {developmentCase.currentPosition}
              </p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Next step
              </p>
              <p className="mt-1 leading-relaxed">{developmentCase.nextStep}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Why this programme fits
              </p>
              <p className="mt-1 leading-relaxed">{developmentCase.whyFits}</p>
            </section>
            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
}: SidebarSelection & {
  roleId: string;
  onClose?: () => void;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const role = getRoleById(roleId);
  if (!role) return null;
  const nextRole = getNextRoleById(role.id);
  const journeyId = getCoreJourneyForRole(role.id);
  const diplomaId = getDiplomaForRole(role.id);
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;
  const gmLine = role.id === "general_manager" ? getGeneralManagerLine() : null;

  const overviewTab = (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-foreground">
        {gmLine ? gmLine.body : overviewLead(role.overview)}
      </p>
      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.nextSteps")}
        </p>
        {nextRole ? (
          <p className="mt-2 text-sm font-medium text-foreground">{nextRole.label}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Continue growing through property and regional leadership opportunities.
          </p>
        )}
      </div>
    </div>
  );

  const optionsTab = (
    <div className="flex flex-col gap-4">
      <div className={DETAIL_BLOCK_CLASS}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.suggested")}
        </p>
        <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-foreground">
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

  return (
    <PanelShell
      eyebrow={t("panel.currentLevel")}
      title={role.label}
      heroImage={heroForId(role.id)}
      heroIcon={<BedDouble className="h-5 w-5" aria-hidden />}
      onClose={onClose}
      tabs={[
        { id: "overview", label: t("panel.tabOverview"), content: overviewTab },
        { id: "options", label: t("panel.tabOptions"), content: optionsTab },
      ]}
    />
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
}: SidebarSelection & {
  programme: Programme;
  onClose?: () => void;
  userContext: NavigatorUserContext | null;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const anchorId = userContext?.currentRoleId ?? null;
  const diplomaId = anchorId ? getDiplomaForRole(anchorId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;
  const leadsTo = programme.leadsTo?.trim();

  const overviewTab = (
    <div className={`space-y-3 text-sm text-foreground ${DETAIL_BLOCK_CLASS}`}>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.whoItsFor")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.whoItsFor}</p>
      </section>
      {leadsTo ? (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("panel.leadsTo")}
          </p>
          <p className="mt-1 leading-relaxed">{leadsTo}</p>
        </section>
      ) : null}
    </div>
  );

  const detailTab = (
    <div className="space-y-4 text-sm text-foreground">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.skills")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.skillsDeveloped}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.expect")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.whatToExpect}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.time")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.timeCommitment}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.nextStep")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.nextStep}</p>
      </section>
    </div>
  );

  const optionsTab = onActivateNode ? (
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
  ) : null;

  const tabs = [
    { id: "overview", label: t("panel.tabOverview"), content: overviewTab },
    { id: "detail", label: t("panel.tabDetail"), content: detailTab },
    ...(optionsTab
      ? [{ id: "options", label: t("panel.tabOptions"), content: optionsTab }]
      : []),
  ];

  return (
    <PanelShell
      eyebrow={t("panel.coreProgramme")}
      title={programme.title}
      subtitle={programmeRelevanceLine(programme)}
      heroImage={heroForId(programme.id)}
      heroIcon={<Footprints className="h-5 w-5" aria-hidden />}
      onClose={onClose}
      tabs={tabs}
      action={
        <button
          type="button"
          className={PRIMARY_CTA_CLASS}
          onClick={() =>
            document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          {t("panel.startNow")}
        </button>
      }
    />
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
}: SidebarSelection & {
  programme: Programme;
  nodeContext: NodeContext;
  onClose?: () => void;
  userContext: NavigatorUserContext | null;
  selectedPersonaId?: string | null;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const [quoteExpanded, setQuoteExpanded] = useState(false);
  const [developmentCase, setDevelopmentCase] =
    useState<DevelopmentCase | null>(null);
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
  const quoteInitials = (nodeContext.quoteAuthor ?? "Colleague")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const anchorId = userContext?.currentRoleId ?? null;
  const journeyId = anchorId ? getCoreJourneyForRole(anchorId) : null;
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const leadsTo = programme.leadsTo?.trim();

  const overviewTab = (
    <div className="flex flex-col gap-4">
      <div className={`space-y-3 text-sm text-foreground ${DETAIL_BLOCK_CLASS}`}>
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("panel.whoItsFor")}
          </p>
          <p className="mt-1 leading-relaxed">{programme.whoItsFor}</p>
        </section>
        {leadsTo ? (
          <section>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("panel.leadsTo")}
            </p>
            <p className="mt-1 leading-relaxed">{leadsTo}</p>
          </section>
        ) : null}
      </div>

      {fullQuote ? (
        <div className="flex gap-3 rounded-lg border bg-muted/40 p-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-foreground ring-2 ring-background shadow-sm"
            aria-hidden
          >
            {quoteInitials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-foreground">
              &ldquo;{quoteDisplay}&rdquo;
            </p>
            {quoteNeedsToggle && (
              <button
                type="button"
                onClick={() => setQuoteExpanded((v) => !v)}
                className="mt-2 text-sm font-medium text-orange-800 underline decoration-orange-800/40 underline-offset-2 hover:text-orange-700"
              >
                {quoteExpanded ? t("panel.readLess") : t("panel.readMore")}
              </button>
            )}
            {nodeContext.quoteAuthor && (
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                — {nodeContext.quoteAuthor}
              </p>
            )}
          </div>
        </div>
      ) : null}

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

  const detailTab = (
    <div className="space-y-4 text-sm text-foreground">
      {nodeContext.whyChooseThis ? (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("panel.whyChoose")}
          </p>
          <p className="mt-1 leading-relaxed">{nodeContext.whyChooseThis}</p>
        </section>
      ) : null}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.expect")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.whatToExpect}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.time")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.timeCommitment}</p>
      </section>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("panel.nextStep")}
        </p>
        <p className="mt-1 leading-relaxed">{programme.nextStep}</p>
      </section>
    </div>
  );

  const managerTab = (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-dashed border-orange-700/80 bg-orange-50/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-700/80">
          Recommended for progression
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
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

    </div>
  );

  return (
    <PanelShell
      eyebrow={t("panel.valueAddProgramme")}
      title={programme.title}
      subtitle={programmeRelevanceLine(programme)}
      heroImage={heroForId(programme.id)}
      heroIcon={<GraduationCap className="h-5 w-5" aria-hidden />}
      accent="orange"
      onClose={onClose}
      tabs={[
        { id: "overview", label: t("panel.tabOverview"), content: overviewTab },
        { id: "detail", label: t("panel.tabDetail"), content: detailTab },
        { id: "manager", label: t("panel.tabManager"), content: managerTab },
      ]}
      action={(setTab) => (
        <button
          type="button"
          className={ADVANCED_PRIMARY_CTA_CLASS}
          onClick={() => setTab("manager")}
        >
          {t("panel.discussManager")}
        </button>
      )}
    />
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
}: SidebarSelection & {
  mapInteractionState?: MapInteractionState;
  selectedStoryId?: string | null;
  userContext: NavigatorUserContext | null;
  selectedPersonaId?: string | null;
  leaderMode?: boolean;
  onClose?: () => void;
  onActivateNode?: ActivateNode;
  onAiFocusChange?: (focus: PathAiFocus | null) => void;
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
    return (
      <PanelShell
        eyebrow={story.pathDescription}
        title={story.name}
        heroImage={heroForId(story.id)}
        heroIcon={
          <span className="text-sm font-semibold">
            {story.name.charAt(0).toUpperCase()}
          </span>
        }
        onClose={onClose}
      >
        <div className={DETAIL_BLOCK_CLASS}>
          <p className="text-sm leading-relaxed text-foreground">
            {story.shortStory}
          </p>
        </div>
      </PanelShell>
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
    const nodeContext = getNodeContext(activeNodeId!);
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
}: SidebarSelection & {
  onClose?: () => void;
  userContext: NavigatorUserContext | null;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const anchorRoleId = userContext?.currentRoleId ?? null;
  const journeyId = anchorRoleId ? getCoreJourneyForRole(anchorRoleId) : null;
  const diplomaId = anchorRoleId ? getDiplomaForRole(anchorRoleId) : null;
  const journeyProg = journeyId ? getProgrammeById(journeyId) : null;
  const diplomaProg = diplomaId ? getProgrammeById(diplomaId) : null;

  return (
    <PanelShell
      eyebrow={t("navigator.heading")}
      title={t("panel.startHere")}
      subtitle={anchorRoleId ? t("panel.emptyWithRole") : t("panel.emptyNoRole")}
      heroImage={heroForId("start-here")}
      heroIcon={<Compass className="h-5 w-5" aria-hidden />}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
      {onActivateNode && (
        <>
          {!anchorRoleId ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">{t("panel.related")}</p>
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
                  <p className="text-xs font-semibold text-foreground">
                    {t("panel.related")}
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
              <details className="rounded-md border border-border bg-muted/40">
                <summary className="cursor-pointer list-none px-3 py-2 text-xs font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="underline decoration-border underline-offset-2">
                    {t("panel.chooseDifferentRole")}
                  </span>
                </summary>
                <div className="flex flex-col gap-2 border-t border-border px-3 pb-3 pt-2">
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
    </PanelShell>
  );
}
