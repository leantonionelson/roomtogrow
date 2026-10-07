import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BedDouble,
  Compass,
  Footprints,
  GraduationCap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PanelShell, { heroForId } from "./PanelShell";
import type {
  DevelopmentCase,
  LearningResource,
  NodeType,
  Programme,
} from "../types/content";
import type { MapInteractionState, NavigatorUserContext } from "../types/ui";
import type { PathAiFocus } from "../data/pathAi";
import { useT } from "../content/ContentProvider";
import {
  buildDevelopmentCase,
  getCoreJourneyForRole,
  getDiplomaForRole,
  getProgrammeById,
  getRoleById,
  getStoryById,
  roles,
} from "../data/contentModel";

const DETAIL_BLOCK_CLASS = "rounded-lg border bg-muted/40 p-3";
const LABEL_CLASS =
  "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

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

/** Learning that lives outside the map; opens its URL once IHG supplies one. */
function ResourceLink({ resource }: { resource: LearningResource }) {
  const t = useT();
  const className =
    "flex w-full items-center justify-between gap-2 rounded-lg border border-dashed px-3 py-2.5 text-left text-sm font-medium transition-colors";
  if (resource.url) {
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} border-border bg-card text-foreground hover:border-ring hover:bg-muted/60`}
      >
        {resource.title}
        <ArrowUpRight className="h-4 w-4 shrink-0 rtl:-scale-x-100" aria-hidden />
      </a>
    );
  }
  return (
    <span
      title={t("panel.linkComingSoon")}
      aria-disabled="true"
      className={`${className} cursor-not-allowed border-border bg-card text-muted-foreground`}
    >
      {resource.title}
      <ArrowUpRight className="h-4 w-4 shrink-0 rtl:-scale-x-100" aria-hidden />
    </span>
  );
}

/** Text link (Learn more / Find out more / Read more). */
function InlineLink({
  url,
  label,
  tone = "primary",
}: {
  url?: string;
  label: string;
  tone?: "primary" | "orange";
}) {
  const t = useT();
  const color =
    tone === "orange"
      ? "text-orange-800 decoration-orange-800/40 hover:text-orange-700"
      : "text-primary decoration-primary/30 hover:text-primary/80";
  const className = `inline-flex items-center gap-1 text-sm font-medium underline underline-offset-2 ${color}`;
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden />
      </a>
    );
  }
  return (
    <span
      title={t("panel.linkComingSoon")}
      aria-disabled="true"
      className={`${className} cursor-not-allowed opacity-60`}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden />
    </span>
  );
}

const PRIMARY_CTA_CLASS =
  "block w-full rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90";
const ADVANCED_PRIMARY_CTA_CLASS =
  "block w-full rounded-lg bg-orange-700 px-3 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-800";

/** Pinned primary CTA (Start now / Enrol now). */
function CtaLink({
  url,
  label,
  className,
}: {
  url?: string;
  label: string;
  className: string;
}) {
  const t = useT();
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <button
      type="button"
      disabled
      title={t("panel.linkComingSoon")}
      className={`${className} cursor-not-allowed opacity-70`}
    >
      {label}
    </button>
  );
}

function InfoSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <p className={LABEL_CLASS}>{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

function LinkGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-border pt-3">
      <p className={LABEL_CLASS}>{label}</p>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

/** Map-node button for a programme, coloured by its type. */
function ProgrammeNavButton({
  programme,
  onActivateNode,
  selectedNodeId,
  selectedProgrammeId,
  selectedNodeType,
}: SidebarSelection & {
  programme: Programme;
  onActivateNode?: ActivateNode;
}) {
  const kind = programme.type === "advanced" ? "advanced" : "core";
  return (
    <MapNavButton
      variant={kind === "advanced" ? "diploma" : "default"}
      label={programme.title}
      nodeId={programme.id}
      isActive={isSidebarNodeActive(
        programme.id,
        selectedNodeId,
        selectedProgrammeId,
        selectedNodeType,
        kind,
      )}
      onActivate={onActivateNode}
    />
  );
}

/** "Related learning" footer: linked map programmes plus outside resources. */
function RelatedLearning({
  programme,
  onActivateNode,
  ...selection
}: SidebarSelection & {
  programme: Programme;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const related = programme.relatedProgrammeIds
    .map((id) => getProgrammeById(id))
    .filter((p): p is Programme => Boolean(p));
  if (related.length === 0 && programme.resources.length === 0) return null;
  return (
    <LinkGroup label={t("panel.related")}>
      {related.map((p) => (
        <ProgrammeNavButton
          key={p.id}
          programme={p}
          onActivateNode={onActivateNode}
          {...selection}
        />
      ))}
      {programme.resources.map((r) => (
        <ResourceLink key={r.title} resource={r} />
      ))}
    </LinkGroup>
  );
}

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

function DevelopmentCaseBlock({
  developmentCase,
}: {
  developmentCase: DevelopmentCase;
}) {
  const t = useT();
  return (
    <div id="ai-output" className="mt-4 border-t border-orange-200/80 pt-4">
      <p className="text-sm font-semibold text-foreground">{t("panel.caseTitle")}</p>
      <div className="mt-3 space-y-4 text-sm text-foreground">
        <InfoSection label={t("panel.caseCurrent")}>
          {developmentCase.currentPosition}
        </InfoSection>
        <InfoSection label={t("panel.caseNext")}>
          {developmentCase.nextStep}
        </InfoSection>
        <InfoSection label={t("panel.caseWhy")}>{developmentCase.whyFits}</InfoSection>
        {developmentCase.whatYouGain.length > 0 && (
          <InfoSection label={t("panel.gain")}>
            <ul className="list-inside list-disc space-y-1">
              {developmentCase.whatYouGain.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </InfoSection>
        )}
      </div>
    </div>
  );
}

function RoleOverviewPanel({
  roleId,
  onClose,
  onActivateNode,
  ...selection
}: SidebarSelection & {
  roleId: string;
  onClose?: () => void;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const role = getRoleById(roleId);
  if (!role) return null;
  const journeyId = getCoreJourneyForRole(role.id);
  const diplomaId = getDiplomaForRole(role.id);
  const suggestedProgrammes = [journeyId, diplomaId]
    .map((id) => (id ? getProgrammeById(id) : null))
    .filter((p): p is Programme => Boolean(p));
  const suggestedResources = role.resources.filter((r) => r.description);
  const hasSuggestions =
    suggestedProgrammes.length > 0 || suggestedResources.length > 0;
  const hasLinks = suggestedProgrammes.length > 0 || role.resources.length > 0;

  return (
    <PanelShell
      eyebrow={t("panel.currentRole")}
      title={role.label}
      subtitle={role.overview}
      heroImage={heroForId(role.id)}
      heroIcon={<BedDouble className="h-5 w-5" aria-hidden />}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {role.nextStep ? (
          <div className={DETAIL_BLOCK_CLASS}>
            <InfoSection label={t("panel.nextStep")}>{role.nextStep}</InfoSection>
          </div>
        ) : null}

        {hasSuggestions ? (
          <InfoSection label={t("panel.suggested")}>
            <ul className="mt-1 space-y-2">
              {suggestedProgrammes.map((p) => (
                <li key={p.id}>
                  <span className="font-medium">{p.title}</span>
                  {p.suggestionLine ? ` — ${p.suggestionLine}` : null}
                </li>
              ))}
              {suggestedResources.map((r) => (
                <li key={r.title}>
                  <span className="font-medium">{r.title}</span> — {r.description}
                </li>
              ))}
            </ul>
          </InfoSection>
        ) : null}

        {hasLinks ? (
          <LinkGroup label={t("panel.exploreFurther")}>
            {suggestedProgrammes.map((p) => (
              <ProgrammeNavButton
                key={p.id}
                programme={p}
                onActivateNode={onActivateNode}
                {...selection}
              />
            ))}
            {role.resources.map((r) => (
              <ResourceLink key={r.title} resource={r} />
            ))}
          </LinkGroup>
        ) : null}
      </div>
    </PanelShell>
  );
}

function CoreProgrammePanel({
  programme,
  onClose,
  onActivateNode,
  ...selection
}: SidebarSelection & {
  programme: Programme;
  onClose?: () => void;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  return (
    <PanelShell
      eyebrow={t("panel.coreProgramme")}
      title={programme.fullTitle || programme.title}
      subtitle={programme.description}
      heroImage={heroForId(programme.id)}
      heroIcon={<Footprints className="h-5 w-5" aria-hidden />}
      onClose={onClose}
      action={
        <CtaLink
          url={programme.ctaUrl}
          label={t("panel.startNow")}
          className={PRIMARY_CTA_CLASS}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div className={`space-y-3 ${DETAIL_BLOCK_CLASS}`}>
          <InfoSection label={t("panel.whoItsFor")}>{programme.whoItsFor}</InfoSection>
          <InfoSection label={t("panel.gain")}>{programme.outcomes}</InfoSection>
        </div>
        <div>
          <InlineLink url={programme.moreInfoUrl} label={t("panel.learnMore")} />
        </div>
        <RelatedLearning
          programme={programme}
          onActivateNode={onActivateNode}
          {...selection}
        />
      </div>
    </PanelShell>
  );
}

function AdvancedProgrammePanel({
  programme,
  onClose,
  userContext,
  selectedPersonaId,
  onActivateNode,
  ...selection
}: SidebarSelection & {
  programme: Programme;
  onClose?: () => void;
  userContext: NavigatorUserContext | null;
  selectedPersonaId?: string | null;
  onActivateNode?: ActivateNode;
}) {
  const t = useT();
  const [quoteExpanded, setQuoteExpanded] = useState(false);
  const [developmentCase, setDevelopmentCase] =
    useState<DevelopmentCase | null>(null);

  useEffect(() => {
    setQuoteExpanded(false);
    setDevelopmentCase(null);
  }, [programme.id]);

  const fullQuote = programme.quote?.trim() ?? "";
  const excerpt = fullQuote ? quoteExcerpt(fullQuote) : "";
  const quoteNeedsToggle = fullQuote.length > excerpt.length;
  const quoteDisplay =
    quoteExpanded || !quoteNeedsToggle ? fullQuote : excerpt;
  const quoteInitials = (programme.quoteAuthor || "Colleague")
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const overviewTab = (
    <div className="flex flex-col gap-4">
      <div className={`space-y-3 ${DETAIL_BLOCK_CLASS}`}>
        <InfoSection label={t("panel.whoItsFor")}>{programme.whoItsFor}</InfoSection>
        <InfoSection label={t("panel.gain")}>{programme.outcomes}</InfoSection>
      </div>
      <div>
        <InlineLink
          url={programme.moreInfoUrl}
          label={t("panel.findOutMore")}
          tone="orange"
        />
      </div>

      {fullQuote ? (
        <figure className="flex gap-3 rounded-lg border bg-muted/40 p-3">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-foreground ring-2 ring-background shadow-sm"
            aria-hidden
          >
            {quoteInitials}
          </span>
          <div className="min-w-0 flex-1">
            <blockquote className="text-sm leading-relaxed text-foreground">
              &ldquo;{quoteDisplay}&rdquo;
            </blockquote>
            {quoteNeedsToggle && (
              <button
                type="button"
                onClick={() => setQuoteExpanded((v) => !v)}
                className="mt-2 text-sm font-medium text-orange-800 underline decoration-orange-800/40 underline-offset-2 hover:text-orange-700"
              >
                {t("panel.readMore")}
              </button>
            )}
            {programme.quoteAuthor && (
              <figcaption className="mt-2 text-xs font-medium text-muted-foreground">
                — {programme.quoteAuthor}
              </figcaption>
            )}
            {programme.quoteUrl ? (
              <div className="mt-2">
                <InlineLink
                  url={programme.quoteUrl}
                  label={t("panel.readMore")}
                  tone="orange"
                />
              </div>
            ) : null}
          </div>
        </figure>
      ) : null}

      <RelatedLearning
        programme={programme}
        onActivateNode={onActivateNode}
        {...selection}
      />
    </div>
  );

  const rightForMeTab = (
    <div className="flex flex-col gap-4">
      {programme.recommendation ? (
        <p className="text-sm leading-relaxed text-foreground">
          {programme.recommendation}
        </p>
      ) : null}

      <div className="rounded-lg border border-dashed border-orange-700/70 bg-orange-50/50 px-3 py-3">
        <p className="text-sm font-semibold text-orange-950">
          {t("panel.talkToManager")}
        </p>
        <button
          type="button"
          onClick={() =>
            setDevelopmentCase(
              buildDevelopmentCase({
                programme,
                currentRoleId: userContext?.currentRoleId,
                selectedPersonaId:
                  userContext?.selectedPersonaId ?? selectedPersonaId,
              }),
            )
          }
          className="mt-3 w-full rounded border border-orange-700 bg-orange-700 px-3 py-2 text-sm font-medium text-white hover:bg-orange-800"
        >
          {t("panel.prepareConversation")}
        </button>
        {developmentCase ? (
          <DevelopmentCaseBlock developmentCase={developmentCase} />
        ) : null}
      </div>

      {programme.faqs.length > 0 ? (
        <Accordion type="single" collapsible className="gap-2">
          {programme.faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={String(i)}
              className="rounded-lg border bg-card px-3"
            >
              <AccordionTrigger className="py-3 text-sm font-medium text-orange-800">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-3 text-sm leading-relaxed text-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : null}
    </div>
  );

  return (
    <PanelShell
      eyebrow={t("panel.diploma")}
      title={programme.fullTitle || programme.title}
      subtitle={programme.description}
      heroImage={heroForId(programme.id)}
      heroIcon={<GraduationCap className="h-5 w-5" aria-hidden />}
      accent="orange"
      onClose={onClose}
      tabs={[
        { id: "overview", label: t("panel.tabOverview"), content: overviewTab },
        { id: "fit", label: t("panel.rightForMe"), content: rightForMeTab },
      ]}
      action={
        <CtaLink
          url={programme.ctaUrl}
          label={t("panel.enrolNow")}
          className={ADVANCED_PRIMARY_CTA_CLASS}
        />
      }
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
        onActivateNode={onActivateNode}
        selectedNodeId={selectedNodeId}
        selectedProgrammeId={selectedProgrammeId}
        selectedNodeType={selectedNodeType}
      />
    );
  }

  if (activeProgramme && effectiveType === "advanced") {
    return (
      <AdvancedProgrammePanel
        programme={activeProgramme}
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
              <p className="text-xs font-semibold text-foreground">{t("map.bandRole")}</p>
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
