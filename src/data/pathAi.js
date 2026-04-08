import {
  getActivePathState,
  getNodeContext,
  getRoleById,
} from "./contentModel";

export const PATH_AI_SYSTEM_PROMPT = `You are a guide inside a structured leadership progression system.

The user is currently at {currentRole} and moving toward {nextRole}.

Progression happens through applied experience (core journey).
Accelerated learning improves efficiency but does not replace experience.

Only give advice grounded in this progression.
Do not give generic leadership advice.
Do not speak broadly - stay within the user's current stage.

Focus on:
- What they need to do
- What typically blocks progression
- How to recognise readiness
- How acceleration changes behaviour

Keep responses concise and direct.`;

const GENERIC_PHRASES = [
  "every leader",
  "in general",
  "it depends",
  "best practice",
];

function getSelectedNodeLabel(selectedNodeId) {
  if (!selectedNodeId) return null;
  return getNodeContext(selectedNodeId)?.title ?? null;
}

export function buildPathAiContext({ userContext, selectedNodeId }) {
  if (!userContext?.currentRoleId) return null;

  const pathState = getActivePathState(userContext);
  const currentRole = getRoleById(pathState.currentRoleId);
  const nextRole = getRoleById(pathState.nextRoleId);

  return {
    currentRoleId: pathState.currentRoleId,
    currentRole: currentRole?.label ?? "Current role",
    nextRoleId: pathState.nextRoleId,
    nextRole: nextRole?.label ?? "Next role",
    acceleration: Boolean(userContext.acceleration),
    selectedNode: getSelectedNodeLabel(selectedNodeId),
    selectedNodeId: selectedNodeId ?? null,
    pathState,
  };
}

function classifyIntent(question = "", isReadinessCheck = false) {
  if (isReadinessCheck) return "readiness";
  const normalized = question.toLowerCase();
  if (normalized.includes("ready")) return "readiness";
  if (normalized.includes("slow") || normalized.includes("block")) return "blockers";
  if (normalized.includes("accelerat")) return "acceleration";
  if (normalized.includes("mistake")) return "mistakes";
  if (normalized.includes("focus") || normalized.includes("first")) return "focus";
  return "focus";
}

function getNodeLean(selectedNodeId) {
  if (!selectedNodeId) return "default";
  if (selectedNodeId.startsWith("hospitality_diploma")) return "diploma";
  if (selectedNodeId.startsWith("journey_")) return "journey";
  return "default";
}

function applyGuardrails(text, context) {
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

function getFocusForIntent(context, intent) {
  const { pathState } = context;
  const nodeIds = [pathState.currentRoleId, pathState.nextRoleId, pathState.journeyNodeId]
    .filter(Boolean);
  const connectorIds = [...pathState.coreConnectorIds];

  if (context.acceleration && pathState.diplomaNodeId) {
    nodeIds.push(pathState.diplomaNodeId);
    connectorIds.push(...pathState.accelerationConnectorIds);
  }

  const focusTagByIntent = {
    focus: "delegation",
    blockers: "enableOthers",
    readiness: "readiness",
    acceleration: "decisionMaking",
    mistakes: "transitionMistakes",
  };

  return {
    nodeIds: [...new Set(nodeIds)],
    connectorIds: [...new Set(connectorIds)],
    tag: focusTagByIntent[intent] ?? "progression",
  };
}

function generateReadinessResponse(context) {
  return `You are close, but two things are missing:

1. Your decisions still rely on escalation.
2. Your team's performance is inconsistent without you.

Focus on stabilising these before progressing to ${context.nextRole}.`;
}

function generateIntentResponse(context, intent, lean) {
  if (intent === "blockers") {
    return `Most ${context.currentRole} to ${context.nextRole} transitions slow down when people keep solving everything themselves.
Progress comes when you set clear standards, delegate ownership, and coach in the moment.
If team output depends on your presence, you are not ready yet.`;
  }

  if (intent === "readiness") {
    return generateReadinessResponse(context);
  }

  if (intent === "acceleration") {
    return `Accelerated learning does not change the path from ${context.currentRole} to ${context.nextRole}.
It shortens hesitation, improves decision quality, and helps you correct mistakes faster.
You still need the same real role experiences to progress.`;
  }

  if (intent === "mistakes") {
    return `A common mistake moving from ${context.currentRole} to ${context.nextRole} is measuring success by personal output instead of team consistency.
Your role is to build repeatable standards and develop others to deliver without escalation.`;
  }

  if (lean === "diploma") {
    return `Use this stage to tighten your frameworks: how you prioritise, review decisions, and explain trade-offs.
The diploma supports clarity, but progression still depends on what changes in your day-to-day leadership behaviour.`;
  }

  if (lean === "journey") {
    return `Focus first on behaviours you can repeat under pressure: delegation, follow-through, and coaching after mistakes.
This journey stage is about action quality, not just understanding what good looks like.`;
  }

  return `Focus first on shifting from doing the work to enabling others to perform at ${context.currentRole} level.
Show readiness for ${context.nextRole} by making decisions earlier, setting clearer expectations, and reducing preventable escalations.`;
}

export function askPathAi({
  userContext,
  selectedNodeId,
  question = "",
  isReadinessCheck = false,
}) {
  const context = buildPathAiContext({ userContext, selectedNodeId });
  if (!context) {
    return {
      ok: false,
      answer: "Choose your current role first, then ask about your path.",
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
      acceleration: context.acceleration,
      selectedNode: context.selectedNode,
    },
    focus: getFocusForIntent(context, intent),
    intent,
  };
}
