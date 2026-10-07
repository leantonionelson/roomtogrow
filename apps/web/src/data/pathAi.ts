import type { ActivePathState, MapMode, UserContext } from "../types/content";
import {
  getActivePathState,
  getNodeTitle,
  getRoleById,
  MAP_MODE,
} from "./contentModel";

export const PATH_AI_SYSTEM_PROMPT = `You are a practical coach helping someone decide their next step at work.

They are currently a {currentRole} and may be moving toward {nextRole}.

Ground your answers in their stage: what to focus on, what readiness looks like, and when to involve their manager.
Do not explain internal systems or frameworks.
Do not give generic leadership advice — stay specific to this stage.

Encourage honest self-assessment and conversations with their manager when formal programmes or progression choices are involved.

Keep responses concise and direct.`;

const GENERIC_PHRASES = [
  "every leader",
  "in general",
  "it depends",
  "best practice",
];

type PathAiIntent =
  | "readiness"
  | "blockers"
  | "managerSponsored"
  | "choice"
  | "mistakes"
  | "focus";

type NodeLean = "default" | "diploma" | "journey";

export interface PathAiContext {
  currentRoleId: string;
  currentRole: string;
  nextRoleId: string | null;
  nextRole: string;
  mapMode: MapMode;
  selectedNode: string | null;
  selectedNodeId: string | null;
  pathState: ActivePathState;
}

export interface PathAiFocus {
  nodeIds: string[];
  connectorIds: string[];
  tag: string;
}

export interface PathAiResult {
  ok: boolean;
  answer: string;
  context: {
    currentRole: string;
    nextRole: string;
    mapMode: MapMode;
    selectedNode: string | null;
  } | null;
  focus: PathAiFocus;
  intent?: PathAiIntent;
}

function getSelectedNodeLabel(selectedNodeId: string | null | undefined): string | null {
  if (!selectedNodeId) return null;
  return getNodeTitle(selectedNodeId);
}

export function buildPathAiContext({
  userContext,
  selectedNodeId,
}: {
  userContext: UserContext | null | undefined;
  selectedNodeId?: string | null;
}): PathAiContext | null {
  if (!userContext?.currentRoleId) return null;

  /** Coach context assumes “explore options” so pathState includes diploma edges. */
  const pathState = getActivePathState({
    ...userContext,
    mapMode: MAP_MODE.exploreNext,
  });
  const currentRole = getRoleById(pathState.currentRoleId);
  const nextRole = getRoleById(pathState.nextRoleId);

  return {
    currentRoleId: pathState.currentRoleId!,
    currentRole: currentRole?.label ?? "Current role",
    nextRoleId: pathState.nextRoleId,
    nextRole: nextRole?.label ?? "Next role",
    mapMode: MAP_MODE.exploreNext,
    selectedNode: getSelectedNodeLabel(selectedNodeId),
    selectedNodeId: selectedNodeId ?? null,
    pathState,
  };
}

function classifyIntent(question = "", isReadinessCheck = false): PathAiIntent {
  if (isReadinessCheck) return "readiness";
  const normalized = question.toLowerCase();
  if (normalized.includes("ready")) return "readiness";
  if (normalized.includes("slow") || normalized.includes("block")) return "blockers";
  if (normalized.includes("accelerat")) return "managerSponsored";
  if (
    normalized.includes("which option") ||
    (normalized.includes("which") && normalized.includes("right"))
  ) {
    return "choice";
  }
  if (normalized.includes("mistake")) return "mistakes";
  if (normalized.includes("focus") || normalized.includes("first") || normalized.includes("next")) {
    return "focus";
  }
  return "focus";
}

function getNodeLean(selectedNodeId: string | null | undefined): NodeLean {
  if (!selectedNodeId) return "default";
  if (selectedNodeId.startsWith("hospitality_diploma")) return "diploma";
  if (selectedNodeId.startsWith("journey_")) return "journey";
  return "default";
}

function applyGuardrails(text: string, context: PathAiContext): string {
  let output = text.trim();
  GENERIC_PHRASES.forEach((phrase) => {
    if (output.toLowerCase().includes(phrase)) {
      output = output.replace(new RegExp(phrase, "gi"), "");
    }
  });

  if (!output.includes(context.currentRole)) {
    output = `At ${context.currentRole} level, ${output.charAt(0).toLowerCase()}${output.slice(1)}`;
  }
  return output.replace(/\s{2,}/g, " ").trim();
}

function getFocusForIntent(
  context: PathAiContext,
  intent: PathAiIntent,
  lean: NodeLean,
): PathAiFocus {
  const { pathState } = context;
  const nodeIds = [
    pathState.currentRoleId,
    pathState.nextRoleId,
    pathState.journeyNodeId,
  ].filter((n): n is string => Boolean(n));
  const connectorIds = [...(pathState.activeCoreConnectorIds ?? [])];

  const exploringNext = context.mapMode === MAP_MODE.exploreNext;
  const includeDiploma =
    exploringNext &&
    pathState.diplomaNodeId &&
    (lean === "diploma" ||
      intent === "managerSponsored" ||
      intent === "choice");

  if (includeDiploma) {
    nodeIds.push(pathState.diplomaNodeId!);
    connectorIds.push(...(pathState.diplomaConnectorIds ?? []));
  }

  const focusTagByIntent: Record<PathAiIntent, string> = {
    focus: "delegation",
    blockers: "enableOthers",
    readiness: "readiness",
    managerSponsored: "decisionMaking",
    choice: "options",
    mistakes: "transitionMistakes",
  };

  return {
    nodeIds: [...new Set(nodeIds)],
    connectorIds: [...new Set(connectorIds)],
    tag: focusTagByIntent[intent] ?? "progression",
  };
}

function generateReadinessResponse(context: PathAiContext): string {
  return `You are close, but two things are missing:

1. Your decisions still rely on escalation.
2. Your team's performance is inconsistent without you.

Focus on stabilising these before progressing to ${context.nextRole}.`;
}

function generateIntentResponse(
  context: PathAiContext,
  intent: PathAiIntent,
  lean: NodeLean,
): string {
  if (intent === "blockers") {
    return `Most ${context.currentRole} to ${context.nextRole} transitions slow down when people keep solving everything themselves.
Progress comes when you set clear standards, delegate ownership, and coach in the moment.
If team output depends on your presence, you are not ready yet.`;
  }

  if (intent === "readiness") {
    return generateReadinessResponse(context);
  }

  if (intent === "managerSponsored") {
    return `Formal qualifications are usually manager-approved. They can strengthen how you lead, but they do not replace what you learn on the job.
Bring this up with your manager to see what fits your timing and goals toward ${context.nextRole}.`;
  }

  if (intent === "choice") {
    return `Start with the core journey for your level — that is what you can act on today.
If a diploma or formal pathway is right for you, your manager can help you weigh timing, eligibility, and how it supports your next step.`;
  }

  if (intent === "mistakes") {
    return `A common mistake moving from ${context.currentRole} to ${context.nextRole} is measuring success by personal output instead of team consistency.
Your role is to build repeatable standards and develop others to deliver without escalation.`;
  }

  if (lean === "diploma") {
    return `A diploma can add structure and recognition, but progression still shows in your day-to-day leadership.
Discuss with your manager whether this pathway matches your development plan and readiness for ${context.nextRole}.`;
  }

  if (lean === "journey") {
    return `Focus first on behaviours you can repeat under pressure: delegation, follow-through, and coaching after mistakes.
This stage is about action quality, not only knowing what good looks like.`;
  }

  return `Focus first on shifting from doing the work to enabling others to perform at ${context.currentRole} level.
Show readiness for ${context.nextRole} by making decisions earlier, setting clearer expectations, and reducing preventable escalations.`;
}

export function askPathAi({
  userContext,
  selectedNodeId,
  question = "",
  isReadinessCheck = false,
}: {
  userContext: UserContext | null | undefined;
  selectedNodeId?: string | null;
  question?: string;
  isReadinessCheck?: boolean;
}): PathAiResult {
  const context = buildPathAiContext({ userContext, selectedNodeId });
  if (!context) {
    return {
      ok: false,
      answer: "Choose your role on the map first, then ask a question.",
      context: null,
      focus: { nodeIds: [], connectorIds: [], tag: "none" },
    };
  }

  const intent = classifyIntent(question, isReadinessCheck);
  const lean = getNodeLean(context.selectedNodeId);
  const response = generateIntentResponse(context, intent, lean);

  return {
    ok: true,
    answer: applyGuardrails(response, context),
    context: {
      currentRole: context.currentRole,
      nextRole: context.nextRole,
      mapMode: context.mapMode,
      selectedNode: context.selectedNode,
    },
    focus: getFocusForIntent(context, intent, lean),
    intent,
  };
}
