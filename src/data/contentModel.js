/**
 * Mock content model for IHG Growth Navigator wireframe.
 * All campaign content is defined here; UI references this module only.
 */

import { MAP_CONNECTORS } from "./mapTopology.js";

export { MAP_CONNECTORS } from "./mapTopology.js";

export const strapline = {
  headline: "Your room to grow. Your world of learning. IHG University.",
  intro:
    "IHG University helps colleagues grow and develop leadership capability. Whether you're taking your next step or supporting your team's development, your journey starts here.",
};

/**
 * Intro section copy: campaign commitment and IHG University explanation (from brief).
 */
export const introBlock = {
  internalComms:
    "Room to Grow is IHG's commitment to helping colleagues develop and progress.",
  ihgUniversityExplanation:
    "IHG University is the place where colleagues build skills, develop leadership capability and prepare for their next step.",
  journeyStartsHere:
    "Whether you're growing your own career or developing your team, your journey starts here.",
};

/**
 * Intent selector: "What brings you here today?" options and contextual copy.
 */
export const intentSelector = {
  question: "What brings you here today?",
  microcopy:
    "Everyone's growth journey looks different. Start with what you're here to do.",
  options: [
    { value: "selfGrowth", label: "I'm exploring my own growth" },
    { value: "developingTeam", label: "I'm developing my team" },
    { value: "learnAbout", label: "I'm learning about Room to Grow" },
  ],
};

/** Map interaction mode: immediate learning vs next-step exploration */
export const MAP_MODE = {
  startNow: "startNow",
  exploreNext: "exploreNext",
};

export const pathAiConfig = {
  sectionTitle: "Not sure what to do next?",
  inputPlaceholder: "Ask what to focus on, readiness, or which step fits you",
  quickPrompts: [
    "What should I focus on next?",
    "Am I ready to move up?",
    "Which option is right for me?",
  ],
};

export const sellingPoints = [
  "Clear career pathways",
  "Learning linked to real roles",
  "Flexible learning that fits around work",
  "Structured leadership development",
  "One place for growth",
];

/**
 * Guidance for managers supporting team development (from brief).
 */
export const managerGuidance = [
  "Encourage the right learning at the right time",
  "Create opportunities to apply learning",
  "Reinforce learning through conversations",
  "Model a culture of development",
];

/**
 * Practical actions leaders can take now (from brief: "4 steps you can take now").
 */
export const leaderActionSteps = [
  "Have a development conversation with each team member",
  "Share the Growth Navigator and help them find their route",
  "Block time in team meetings for learning and reflection",
  "Celebrate when someone completes a programme or milestone",
];

export const roles = [
  {
    id: "frontline",
    level: 0,
    label: "Frontline colleague",
    overview:
      "Frontline colleagues deliver our guest experience every day—whether in rooms, food and beverage, or front desk. This is where many growth journeys start, with hands-on experience and pathways into supervision and beyond.",
    quote:
      "I started on the front desk. Room to Grow helped me see that my next step was within reach.",
    quoteAuthor: "Frontline colleague, UK",
  },
  {
    id: "supervisor",
    level: 1,
    label: "Supervisor",
    overview:
      "Supervisors lead a small team or shift, supporting day-to-day operations and developing their first leadership skills. It's the first step into people leadership and a bridge to management.",
    quote:
      "Becoming a supervisor was the moment I realised I could grow without leaving what I love—hospitality.",
    quoteAuthor: "Supervisor, Europe",
  },
  {
    id: "manager",
    level: 2,
    label: "Manager",
    overview:
      "Managers lead a team or department, with responsibility for performance, development, and delivery. They balance operational excellence with people leadership and are key to developing the next generation of leaders.",
    quote:
      "As a manager, I'm not just running the department—I'm helping my team see their own routes to grow.",
    quoteAuthor: "Manager, IHG",
  },
  {
    id: "senior_manager",
    level: 3,
    label: "Senior Manager",
    overview:
      "Senior managers lead larger teams or multiple areas, often with broader business or regional responsibility. They shape strategy, drive change, and develop other managers—a critical step toward general management.",
    quote:
      "The jump to senior manager was about thinking beyond my patch. Room to Grow showed me the programmes that got me there.",
    quoteAuthor: "Senior Manager",
  },
  {
    id: "general_manager",
    level: 4,
    label: "General Manager",
    overview:
      "General Managers lead the property and its performance end to end—guest experience, commercial results, and team culture. They are the face of the hotel and set the tone for growth and development on site.",
    quote:
      "My role is to create a place where everyone can grow. IHG University and Room to Grow are how we make that real.",
    quoteAuthor: "General Manager, IHG",
  },
];

export const personas = [
  {
    id: "pathfinders",
    label: "Pathfinders",
    description:
      "Individual contributors exploring growth and their next career step.",
    panelFocusSelf: "What you will learn and how it helps your career.",
    panelFocusLeader: "How to support colleagues exploring their own growth.",
  },
  {
    id: "growth_guides",
    label: "Growth Guides",
    description: "Managers developing their teams and building capability.",
    panelFocusSelf: "Skills you will gain for your own progression.",
    panelFocusLeader: "How to support your team and enable their development.",
  },
  {
    id: "future_builders",
    label: "Future Builders",
    description: "Senior leaders building pipeline and succession.",
    panelFocusSelf: "Leadership development for senior roles.",
    panelFocusLeader: "How to build pipeline and develop future leaders.",
  },
  {
    id: "independent_leaders",
    label: "Independent Leaders",
    description: "Owners balancing autonomy and standards.",
    panelFocusSelf: "Development that fits your context.",
    panelFocusLeader: "How to maintain standards while supporting growth.",
  },
  {
    id: "promoters",
    label: "Promoters",
    description: "HR and operations leaders supporting capability across the business.",
    panelFocusSelf: "Overview of learning and progression options.",
    panelFocusLeader: "How to promote and embed learning in your area.",
  },
];

/**
 * Qualifying questions to determine persona without using internal labels.
 * Each option maps to a persona id so we never ask "which persona are you?"
 */
export const personaQualifyingQuestions = [
  {
    id: "goal",
    question: "What do you want to get from IHG University?",
    options: [
      { label: "I want to find my next career step and grow", personaId: "pathfinders" },
      { label: "I want to develop my team and build their capability", personaId: "growth_guides" },
      { label: "I'm building future leaders and succession pipeline", personaId: "future_builders" },
      { label: "I run my own unit and want development that fits my context", personaId: "independent_leaders" },
      { label: "I support learning and capability across my area or the business", personaId: "promoters" },
    ],
  },
];

/**
 * Each programme has `type`: "core" (journey / standard learning) or "advanced"
 * (diplomas / manager-approved programmes). UI uses this for CTAs and AI support.
 */
export const programmes = [
  {
    id: "journey_supervisor",
    type: "core",
    levels: [0, 1],
    title: "Journey to Supervisor",
    mapSummary:
      "Prepares you for your first people-leadership step with practical, blended learning.",
    leadsTo: "Your next role on the map: Supervisor.",
    whoItsFor: "Frontline colleagues ready to step into a first leadership role.",
    skillsDeveloped: "Delegation, team coordination, basic people management.",
    whatToExpect: "Blended learning with practical application in your role.",
    timeCommitment: "Flexible over 4–6 weeks.",
    nextStep: "Discuss with your manager and enrol via IHG University.",
  },
  {
    id: "journey_manager",
    type: "core",
    levels: [1, 2],
    title: "Journey to Manager",
    mapSummary:
      "Builds the management skills you need to lead a team or department with confidence.",
    leadsTo: "Your next role on the map: Manager.",
    whoItsFor: "Supervisors aiming to become managers.",
    skillsDeveloped: "Performance management, planning, stakeholder communication.",
    whatToExpect: "Structured programme with workshops and on-the-job projects.",
    timeCommitment: "Flexible over 8–12 weeks.",
    nextStep: "Complete Journey to Supervisor and apply for Journey to Manager.",
  },
  {
    id: "journey_senior_manager",
    type: "core",
    levels: [2, 3],
    title: "Journey to Senior Manager",
    mapSummary:
      "Strengthens strategy, change and leading-managers capability for the tier above.",
    leadsTo: "Your next role on the map: Senior Manager.",
    whoItsFor: "Managers preparing for senior leadership.",
    skillsDeveloped: "Strategy, change management, leading managers.",
    whatToExpect: "Leadership modules and business projects.",
    timeCommitment: "Flexible over 12–16 weeks.",
    nextStep: "Complete Journey to Manager and discuss with your GM.",
  },
  {
    id: "journey_gm",
    type: "core",
    levels: [3, 4],
    title: "Journey to General Manager",
    mapSummary:
      "Executive-style development for property-wide leadership and commercial judgement.",
    leadsTo: "Your next role on the map: General Manager.",
    whoItsFor: "Senior managers ready for GM roles.",
    skillsDeveloped: "P&L, property leadership, commercial and people strategy.",
    whatToExpect: "Executive-level development and mentoring.",
    timeCommitment: "Flexible over 6–12 months.",
    nextStep: "Apply through your regional leadership team.",
  },
  {
    id: "core_leadership",
    type: "core",
    levels: [1, 2, 3, 4],
    title: "Core Leadership Learning",
    mapSummary:
      "Bite-sized essentials you can stack alongside your day job—feedback, coaching, and more.",
    leadsTo: "Stronger leadership practice in your current or next people-leading role.",
    whoItsFor: "Anyone in or moving into a people-leading role.",
    skillsDeveloped: "Core leadership essentials, feedback, coaching.",
    whatToExpect: "Bite-sized modules and practical tools.",
    timeCommitment: "Ongoing; pick what fits your schedule.",
    nextStep: "Browse modules in IHG University.",
  },
  {
    id: "leadership_diplomas",
    type: "advanced",
    levels: [2, 3, 4],
    title: "Leadership Diplomas",
    mapSummary:
      "Formal diploma-level leadership with assessment—ideal when you want recognised depth.",
    leadsTo: "Accredited leadership credentials to support progression conversations.",
    whoItsFor: "Managers and senior managers seeking formal recognition.",
    skillsDeveloped: "Leadership theory and practice at diploma level.",
    whatToExpect: "Accredited learning with assessment.",
    timeCommitment: "Varies by level; typically 6–12 months.",
    nextStep: "Check eligibility and apply via IHG University.",
  },
  {
    id: "hospitality_diploma_3",
    type: "advanced",
    levels: [0, 1],
    title: "Foundational Diploma of Hospitality Leadership",
    mapSummary:
      "Turn guest-facing experience into a recognised qualification alongside your journey.",
    leadsTo: "Credentials and language for leadership that complement Journey programmes.",
    whoItsFor: "Frontline and supervisory colleagues.",
    skillsDeveloped: "Hospitality operations, customer service, team support.",
    whatToExpect: "Industry-recognised qualification.",
    timeCommitment: "Flexible; typically 6–12 months.",
    nextStep: "Enrol through your property or regional L&D contact.",
    whyChooseThis:
      "Turn everyday guest-facing experience into a recognised qualification—so your next step is backed by credentials as well as confidence.",
    quote:
      "I wanted something official on my CV, not just ‘I’ve done the job.’ The diploma gave me language for leadership and opened doors my manager and I hadn’t talked about yet.",
    quoteAuthor: "Housekeeping supervisor, UK",
  },
  {
    id: "hospitality_diploma_4",
    type: "advanced",
    levels: [1, 2],
    title: "Diploma of Hospitality Leadership",
    mapSummary:
      "Deeper operational and leadership judgement for supervisors and managers.",
    leadsTo: "Structured leadership skills matched to how hospitality actually runs.",
    whoItsFor: "Supervisors and managers.",
    skillsDeveloped: "Management and leadership in hospitality.",
    whatToExpect: "Higher-level operational and leadership skills.",
    timeCommitment: "Flexible; typically 12–18 months.",
    nextStep: "Complete Level 3 or meet entry requirements.",
    whyChooseThis:
      "Go deeper than day-to-day tasks: build structured leadership judgement, stakeholder skills, and a pathway that matches how hospitality actually runs.",
    quote:
      "Journey programmes got me started; the diploma is where I learned to think like a leader across the whole operation—not only my shift.",
    quoteAuthor: "F&B manager, Europe",
  },
  {
    id: "hospitality_diploma_5",
    type: "advanced",
    levels: [2, 3, 4],
    title: "Advanced Diploma of Hospitality Leadership",
    mapSummary:
      "Strategic and senior leadership development with a qualification that signals readiness.",
    leadsTo: "Preparation for GM and regional scope—culture, pipeline, commercial acumen.",
    whoItsFor: "Managers and senior managers.",
    skillsDeveloped: "Strategic and senior leadership in hospitality.",
    whatToExpect: "Strategic leadership qualification.",
    timeCommitment: "Flexible; typically 18–24 months.",
    nextStep: "Discuss with your GM or regional L&D.",
    whyChooseThis:
      "Prepare for senior and general-management scope: strategy, commercial acumen, and developing other leaders—with a qualification that signals you’re ready.",
    quote:
      "At senior manager level you’re expected to shape culture and pipeline, not just deliver results. The advanced diploma gave me frameworks I still use with my GMs and regional team.",
    quoteAuthor: "Senior manager, IHG",
  },
];

export const stories = [
  {
    id: "maria",
    name: "Maria",
    pathDescription: "Housekeeping → Supervisor → Manager",
    shortStory:
      "Maria started in Housekeeping and used Room to Grow to see her path to Supervisor, then Manager. She completed Journey to Supervisor and Journey to Manager and now leads her own team.",
  },
  {
    id: "james",
    name: "James",
    pathDescription: "Frontline → Supervisor → Senior Manager",
    shortStory:
      "James used the Growth Navigator to plan his route from frontline to Senior Manager. He combined leadership programmes with the Hospitality Diploma and is now developing future leaders.",
  },
];

const coreJourneyByRoleId = {
  frontline: "journey_supervisor",
  supervisor: "journey_manager",
  manager: "journey_senior_manager",
  senior_manager: "journey_gm",
};

const diplomaByRoleId = {
  supervisor: "hospitality_diploma_3",
  manager: "hospitality_diploma_4",
  senior_manager: "hospitality_diploma_5",
};

export const faqs = [
  {
    id: "how_start",
    question: "How do I start?",
    answer:
      "Use the Growth Navigator map to choose your current role, then tap Start learning now or Next step (your target role on the map) to see what fits you.",
  },
  {
    id: "how_long",
    question: "How long does learning take?",
    answer:
      "It depends on the programme and how much time you can give. Most journeys are flexible and designed to fit around your role. Use the time filter to see options that match your availability.",
  },
  {
    id: "manager_support",
    question: "Do I need my manager's support?",
    answer:
      "We recommend discussing your goals with your manager. They can help you prioritise and align learning with your role. Many programmes include manager check-ins or sign-off.",
  },
  {
    id: "support_team",
    question: "How do I support my team?",
    answer:
      "Select 'I'm developing my team' to see content tailored to leaders. You'll get guidance on how to support your team's growth, have development conversations, and use IHG University with your people.",
  },
];

/**
 * Returns relevant node IDs based on the user's role and goal
 */
export function getRelevantNodes(userContext) {
  return getActivePathState(userContext).highlightedNodeIds;
}

export function getNextRoleById(currentRoleId) {
  const currentRole = roles.find((r) => r.id === currentRoleId);
  if (!currentRole) return null;
  return roles.find((r) => r.level === currentRole.level + 1) ?? null;
}

export function getCoreJourneyForRole(currentRoleId) {
  return coreJourneyByRoleId[currentRoleId] ?? null;
}

export function getDiplomaForRole(currentRoleId) {
  return diplomaByRoleId[currentRoleId] ?? null;
}

function isForwardMapEdge(type) {
  return type === "core" || type === "diplomaPath";
}

/** Core journey programme id for this hotel role, if any. */
export function getRelevantCoreNodes(roleId) {
  const j = getCoreJourneyForRole(roleId);
  return j ? [j] : [];
}

/** Value-add diploma node id for this hotel role, if any. */
export function getRelevantAdvancedNodes(roleId) {
  const d = getDiplomaForRole(roleId);
  return d ? [d] : [];
}

/**
 * Soft-suggestion connector ids when a role is selected (core + diploma routes from this role).
 */
export function getRelevantPathsForRole(roleId, connectorList = MAP_CONNECTORS) {
  const nextRoleId = getNextRoleById(roleId)?.id ?? null;
  const journeyNodeId = getCoreJourneyForRole(roleId);
  const diplomaNodeId = getDiplomaForRole(roleId);
  const ids = [];
  if (journeyNodeId) ids.push(`${roleId}->${journeyNodeId}`);
  if (journeyNodeId && nextRoleId) ids.push(`${journeyNodeId}->${nextRoleId}`);
  if (diplomaNodeId) ids.push(`${roleId}->${diplomaNodeId}`);
  if (diplomaNodeId && nextRoleId) ids.push(`${diplomaNodeId}->${nextRoleId}`);
  return ids.filter((id) => connectorList.some((c) => c.id === id));
}

/**
 * Shortest forward path (core + diploma edges only) from role to node; edge ids in order.
 */
export function getConnectionsForSelection(
  roleId,
  nodeId,
  connectorList = MAP_CONNECTORS,
) {
  if (!roleId || !nodeId || roleId === nodeId) return [];
  const edges = connectorList.filter((c) => isForwardMapEdge(c.type));
  const adj = new Map();
  for (const c of edges) {
    if (!adj.has(c.fromId)) adj.set(c.fromId, []);
    adj.get(c.fromId).push({ toId: c.toId, id: c.id });
  }
  const queue = [[roleId, /** @type {string[]} */ ([])]];
  const seen = new Set([roleId]);
  while (queue.length) {
    const [node, pathIds] = queue.shift();
    if (node === nodeId) return pathIds;
    for (const { toId, id } of adj.get(node) ?? []) {
      if (seen.has(toId)) continue;
      seen.add(toId);
      queue.push([toId, [...pathIds, id]]);
    }
  }
  return [];
}

/**
 * When an advanced (diploma) node is committed, softly highlight linked core progression.
 */
export function getSupportingHighlightsForAdvanced(roleId, _diplomaId) {
  const journeyNodeId = getCoreJourneyForRole(roleId);
  const nextRoleId = getNextRoleById(roleId)?.id ?? null;
  const nodeIds = [journeyNodeId, nextRoleId].filter(Boolean);
  const connectionIds = [];
  if (journeyNodeId) connectionIds.push(`${roleId}->${journeyNodeId}`);
  if (journeyNodeId && nextRoleId) {
    connectionIds.push(`${journeyNodeId}->${nextRoleId}`);
  }
  return { nodeIds, connectionIds };
}

/**
 * Role that has a direct forward edge into this programme node (core or diploma).
 */
export function inferAnchorRoleForProgramme(
  programmeId,
  connectorList = MAP_CONNECTORS,
) {
  const incoming = connectorList.find(
    (c) =>
      isForwardMapEdge(c.type) &&
      c.toId === programmeId &&
      roles.some((r) => r.id === c.fromId),
  );
  return incoming?.fromId ?? null;
}

/** Node ids to softly emphasise when a role is selected (suggest state). */
export function getSuggestHighlightNodeIds(roleId) {
  const nextRoleId = getNextRoleById(roleId)?.id ?? null;
  const journeyId = getCoreJourneyForRole(roleId);
  const diplomaId = getDiplomaForRole(roleId);
  return [...new Set([roleId, nextRoleId, journeyId, diplomaId].filter(Boolean))];
}

/**
 * Nodes that should stay visible (not heavily faded) when a programme is committed.
 */
export function getCommittedHighlightNodeIds(
  roleId,
  selectedNodeId,
  selectedNodeType,
) {
  if (!roleId || !selectedNodeId || selectedNodeType === "role") return [];
  const pathEdgeIds = getConnectionsForSelection(roleId, selectedNodeId);
  const nodes = new Set([roleId, selectedNodeId]);
  for (const eid of pathEdgeIds) {
    const c = MAP_CONNECTORS.find((x) => x.id === eid);
    if (c) {
      nodes.add(c.fromId);
      nodes.add(c.toId);
    }
  }
  if (selectedNodeType === "advanced" && selectedNodeId.startsWith("hospitality_diploma")) {
    getSupportingHighlightsForAdvanced(roleId, selectedNodeId).nodeIds.forEach((n) =>
      nodes.add(n),
    );
  }
  return [...nodes];
}

/** Soft connector ids alongside a committed diploma selection. */
export function getCommittedSoftConnectionIds(
  roleId,
  selectedNodeId,
  selectedNodeType,
) {
  if (selectedNodeType !== "advanced") return [];
  if (!selectedNodeId?.startsWith("hospitality_diploma")) return [];
  return getSupportingHighlightsForAdvanced(roleId, selectedNodeId).connectionIds;
}

/** Persona narrowing for soft highlights: extend when persona→node mapping exists. */
export function intersectSuggestNodesWithPersona(softNodeIds, _selectedPersonaId) {
  return softNodeIds;
}

/**
 * Connector IDs for map focus highlighting: **forward-only** path (vector, not full network).
 * Role: role → core journey → next role; if mapMode is exploreNext, adds role → diploma → next role.
 * Journey / diploma: forward outgoing steps only (no incoming “past” edges).
 */
export function getForwardConnectorIdsForFocus(focusId, mapMode, connectorList) {
  const out = new Set();
  if (!focusId || !connectorList?.length) return out;

  const explore = mapMode === MAP_MODE.exploreNext;

  const role = roles.find((r) => r.id === focusId);
  if (role) {
    const toJourney = connectorList.find((c) => c.type === "core" && c.fromId === focusId);
    if (toJourney) {
      out.add(toJourney.id);
      const nextHop = connectorList.find(
        (c) => c.type === "core" && c.fromId === toJourney.toId,
      );
      if (nextHop) out.add(nextHop.id);
    }
    if (explore) {
      const dipEdge = connectorList.find(
        (c) => c.type === "diplomaPath" && c.fromId === focusId,
      );
      if (dipEdge) {
        out.add(dipEdge.id);
        const afterDip = connectorList.find(
          (c) => c.type === "diplomaPath" && c.fromId === dipEdge.toId,
        );
        if (afterDip) out.add(afterDip.id);
      }
    }
    return out;
  }

  if (focusId.startsWith("journey_")) {
    const jToR = connectorList.find((c) => c.type === "core" && c.fromId === focusId);
    if (jToR) {
      out.add(jToR.id);
      const roleId = jToR.toId;
      const rToJ2 = connectorList.find((c) => c.type === "core" && c.fromId === roleId);
      if (rToJ2) {
        out.add(rToJ2.id);
        const j2ToR2 = connectorList.find((c) => c.type === "core" && c.fromId === rToJ2.toId);
        if (j2ToR2) out.add(j2ToR2.id);
      }
    }
    return out;
  }

  if (focusId.startsWith("hospitality_diploma")) {
    connectorList
      .filter((c) => c.type === "diplomaPath" && c.fromId === focusId)
      .forEach((c) => out.add(c.id));
  }

  return out;
}

/** Role ids at levels below the current role (dim in explore-next view). */
export function getPastRoleIds(currentRoleId) {
  const current = roles.find((r) => r.id === currentRoleId);
  if (!current) return [];
  return roles.filter((r) => r.level < current.level).map((r) => r.id);
}

/**
 * One-line copy for "Start learning now" sidebar (user-first, not system framing).
 */
export function getStartLearningLineForRole(currentRoleId) {
  const lines = {
    frontline:
      "Build confidence in your role and see a clear path into leadership.",
    supervisor:
      "Build your confidence leading a team and managing day-to-day operations.",
    manager:
      "Strengthen how you lead performance, development, and delivery.",
    senior_manager:
      "Develop broader leadership and prepare for general management.",
    general_manager:
      "Continue expressing leadership through how you grow others and the business.",
  };
  return lines[currentRoleId] ?? "";
}

/**
 * Returns the active path model for map highlighting and connector styling.
 */
export function getActivePathState(userContext) {
  if (!userContext?.currentRoleId) {
    return {
      currentRoleId: null,
      mapMode: null,
      nextRoleId: null,
      journeyNodeId: null,
      diplomaNodeId: null,
      highlightedNodeIds: [],
      softHighlightNodeIds: [],
      coreConnectorIds: [],
      activeCoreConnectorIds: [],
      diplomaConnectorIds: [],
      fallbackConnectorIds: [],
    };
  }

  const currentRoleId = userContext.currentRoleId;
  const mapMode = userContext.mapMode ?? MAP_MODE.startNow;
  const nextRoleId = getNextRoleById(currentRoleId)?.id ?? null;
  const journeyNodeId = getCoreJourneyForRole(currentRoleId);
  const diplomaNodeId = getDiplomaForRole(currentRoleId);

  const diplomaConnectorIds = [];
  if (diplomaNodeId) diplomaConnectorIds.push(`${currentRoleId}->${diplomaNodeId}`);
  if (diplomaNodeId && nextRoleId) diplomaConnectorIds.push(`${diplomaNodeId}->${nextRoleId}`);

  const fullCoreConnectorIds = [];
  if (journeyNodeId) fullCoreConnectorIds.push(`${currentRoleId}->${journeyNodeId}`);
  if (journeyNodeId && nextRoleId) fullCoreConnectorIds.push(`${journeyNodeId}->${nextRoleId}`);

  const fallbackConnectorIds = [];
  if (journeyNodeId && currentRoleId) fallbackConnectorIds.push(`${journeyNodeId}->${currentRoleId}`);

  let highlightedNodeIds = [];
  let softHighlightNodeIds = [];
  let activeCoreConnectorIds = [];

  if (mapMode === MAP_MODE.startNow) {
    highlightedNodeIds = [currentRoleId];
    if (journeyNodeId) highlightedNodeIds.push(journeyNodeId);
    activeCoreConnectorIds = journeyNodeId
      ? [`${currentRoleId}->${journeyNodeId}`]
      : [];
  } else {
    highlightedNodeIds = [currentRoleId];
    if (nextRoleId) highlightedNodeIds.push(nextRoleId);
    if (journeyNodeId) highlightedNodeIds.push(journeyNodeId);
    if (diplomaNodeId) {
      highlightedNodeIds.push(diplomaNodeId);
      softHighlightNodeIds = [diplomaNodeId];
    }
    activeCoreConnectorIds = [...fullCoreConnectorIds];
  }

  return {
    currentRoleId,
    mapMode,
    nextRoleId,
    journeyNodeId,
    diplomaNodeId,
    highlightedNodeIds: [...new Set(highlightedNodeIds)],
    softHighlightNodeIds,
    coreConnectorIds: fullCoreConnectorIds,
    activeCoreConnectorIds,
    diplomaConnectorIds,
    fallbackConnectorIds,
  };
}

/**
 * Get structured context for a node in the panel.
 */
export function getNodeContext(nodeId) {
  const programme = programmes.find(p => p.id === nodeId);
  if (programme) {
    return {
      title: programme.title,
      type: programme.type,
      whoItsFor: programme.whoItsFor,
      whatItHelpsWith: programme.skillsDeveloped || programme.whatToExpect,
      whatItLeadsTo: programme.nextStep,
      whyChooseThis: programme.whyChooseThis,
      quote: programme.quote,
      quoteAuthor: programme.quoteAuthor,
    };
  }
  
  const role = roles.find(r => r.id === nodeId);
  if (role) {
    return {
      title: role.label,
      type: "role",
      whoItsFor: "Role overview",
      whatItHelpsWith: role.overview,
      whatItLeadsTo: "Explore programmes to reach this role",
      quote: role.quote,
      quoteAuthor: role.quoteAuthor
    };
  }

  return null;
}

/**
 * Deterministic “development case” copy for manager conversations (advanced programmes).
 * Uses only fields from the content model — no API or randomness.
 */
export function buildDevelopmentCase({
  programme,
  currentRoleId,
  selectedPersonaId,
}) {
  if (!programme) return null;

  const currentRole = currentRoleId ? getRoleById(currentRoleId) : null;
  const nextRole = currentRoleId ? getNextRoleById(currentRoleId) : null;
  const currentLabel = currentRole?.label ?? "colleague";
  const nextLabel = nextRole?.label ?? "your next step";

  const persona = selectedPersonaId
    ? personas.find((p) => p.id === selectedPersonaId)
    : null;
  const personaClause = persona?.panelFocusSelf
    ? ` This connects to your focus: ${persona.panelFocusSelf}`
    : "";

  const whyFits = `${programme.title} is aimed at ${programme.whoItsFor?.trim() ?? "colleagues building on their current role"} — a strong match as you move from ${currentLabel} toward ${nextLabel}.${personaClause}`;

  const bullets = [];
  if (programme.skillsDeveloped?.trim()) {
    bullets.push(programme.skillsDeveloped.trim().replace(/\s*$/, "").replace(/[.;]$/, "") + ".");
  }
  if (programme.whatToExpect?.trim()) {
    bullets.push(programme.whatToExpect.trim().replace(/\s*$/, "").replace(/[.;]$/, "") + ".");
  }
  if (programme.timeCommitment?.trim() && bullets.length < 3) {
    bullets.push(`Time commitment: ${programme.timeCommitment.trim().replace(/\s*$/, "").replace(/[.;]$/, "")}.`);
  }
  const whatYouGain = bullets.slice(0, 3);

  return {
    currentPosition: `You are currently a ${currentLabel} preparing for ${nextLabel}.`,
    nextStep: `This programme supports your transition to ${nextLabel}.`,
    whyFits,
    whatYouGain,
  };
}

/** Keys for advanced programme secondary prompts (stable ids for copy lookup). */
export const ADVANCED_CONVERSATION_PROMPT_IDS = {
  ready: "ready",
  focus: "focus",
  explain: "explain",
};

/**
 * Short deterministic guidance for advanced programme prompt buttons (not chat).
 */
export function getAdvancedConversationGuidance(promptId, programme) {
  if (!programme?.title) return "";
  const title = programme.title;
  switch (promptId) {
    case ADVANCED_CONVERSATION_PROMPT_IDS.ready:
      return `Readiness for ${title} depends on your current responsibilities and whether you can commit to the programme alongside your role. Be direct with your manager about strengths, gaps, and whether timing fits team priorities — they can help you judge formal readiness.`;
    case ADVANCED_CONVERSATION_PROMPT_IDS.focus:
      return `Before you meet your manager, clarify entry expectations for ${title}, how it sits alongside your core journey, and one outcome you want from the first phase. Lead with those priorities so the conversation stays practical.`;
    case ADVANCED_CONVERSATION_PROMPT_IDS.explain:
      return `Frame ${title} as aligned with your progression: it is for ${programme.whoItsFor?.trim() ?? "colleagues at your stage"}. Mention ${programme.whatToExpect?.trim() ?? "the structured learning and assessment"} and ask for their view on timing, sponsorship, and how it fits your development plan.`;
    default:
      return "";
  }
}

/**
 * Get programme by id.
 */
/** First sentence (up to “. ”) for short role overview copy. */
export function overviewLead(overview) {
  const o = overview?.trim() ?? "";
  if (!o) return "";
  const i = o.indexOf(". ");
  return i > 0 ? o.slice(0, i + 1) : o;
}

/**
 * One-line relevance for programmes (sidebar + map tooltips).
 * Prefers `mapSummary`; otherwise first sentence of `whoItsFor`.
 */
export function programmeRelevanceLine(programme) {
  if (!programme) return "";
  const m = programme.mapSummary?.trim();
  if (m) return m;
  const w = programme.whoItsFor?.trim() ?? "";
  if (!w) return "";
  const end = w.search(/[.!?](\s|$)/);
  if (end > 0) return w.slice(0, end + 1);
  return w;
}

export function getProgrammeById(id) {
  return programmes.find((p) => p.id === id) ?? null;
}

/**
 * Get story by id.
 */
export function getStoryById(id) {
  return stories.find((s) => s.id === id) ?? null;
}

/**
 * Get role label by id.
 */
export function getRoleLabel(roleId) {
  return roles.find((r) => r.id === roleId)?.label ?? roleId;
}

/**
 * Get full role by id (includes overview, quote, quoteAuthor).
 */
export function getRoleById(id) {
  return roles.find((r) => r.id === id) ?? null;
}
