/**
 * Static content model for the Room to Grow / Growth Navigator page.
 * Copy is from IHG's "Room to Grow Landing Page Content" sheet (Updated copy
 * column); it doubles as the CMS seed and the offline fallback.
 */

import type {
  ActivePathState,
  ConnectorType,
  DevelopmentCase,
  Faq,
  IntentSelectorContent,
  IntroBlock,
  MapConnector,
  MapMode,
  NodeType,
  PathAiConfig,
  Persona,
  PersonaQualifyingQuestion,
  Programme,
  Role,
  SellingPoint,
  Story,
  Strapline,
  UserContext,
} from "../types/content";
import { MAP_CONNECTORS } from "./mapTopology";

export { MAP_CONNECTORS } from "./mapTopology";

export const strapline: Strapline = {
  headline: "Your world of learning. IHG University.",
  intro:
    "IHG University offers practical, flexible leadership learning that’s open to all, no matter where you are now or where you’re heading.",
};

/**
 * "About IHG University" section: headline + supporting paragraph.
 */
export const introBlock: IntroBlock = {
  internalComms: "We believe great leaders aren't born – they're developed.",
  ihgUniversityExplanation:
    "Our leadership learning programmes are designed to grow your skills at every stage of your career. Whether you're stepping into your first supervisory role or looking to develop the strategic thinking of a senior leader, IHG University offers a clear, connected pathway of learning, including eLearning programmes and accredited diplomas.",
};

/**
 * Intent selector: "What are you looking for today?" options and contextual copy.
 */
export const intentSelector: IntentSelectorContent = {
  question: "What are you looking for today?",
  microcopy: "Every journey is different. Let's start yours.",
  options: [
    { value: "selfGrowth", label: "I'm exploring my next step" },
    { value: "developingTeam", label: "I'm developing my team" },
  ],
};

/** Map interaction mode: immediate learning vs next-step exploration */
export const MAP_MODE = {
  startNow: "startNow",
  exploreNext: "exploreNext",
} as const satisfies Record<string, MapMode>;

export const pathAiConfig: PathAiConfig = {
  sectionTitle: "Not sure what to do next?",
  inputPlaceholder: "Ask what to focus on, readiness, or which step fits you",
  quickPrompts: [
    "What should I focus on next?",
    "Am I ready to move up?",
    "Which option is right for me?",
  ],
};

/** "Why invest your time with IHG University?" carousel cards. */
export const sellingPoints: SellingPoint[] = [
  {
    title: "Learn at your own pace",
    body: "Our Journey to... programmes are free, self-directed eLearning that's available anytime, anywhere, so you can build your leadership skills around your schedule.",
  },
  {
    title: "Progress with clear pathways",
    body: "From Supervisor to Senior Manager, every programme is designed to meet you where you are and take you where you want to go next.",
  },
  {
    title: "Earn a recognised qualification",
    body: "Our accredited Diploma programmes give you a formal, internationally recognised qualification that shows your leadership capability to the world.",
  },
  {
    title: "Learn skills you can start using straightaway",
    body: "Every module is built around real hospitality challenges – from coaching your team and managing change, to thinking commercially and communicating with impact.",
  },
  {
    title: "Get support every step of the way",
    body: "With manager conversation guides, reflection tools and a global learning community, you're never developing alone.",
  },
];

/**
 * "How to support development" column of the manager section.
 */
export const managerGuidance = [
  "Have regular one-to-one conversations about career goals and development.",
  "Use the manager conversation guides included in each programme.",
  "Recognise and celebrate learning milestones — completing a module is worth acknowledging.",
  "Create space for your team to apply what they're learning on the job.",
];

/**
 * "Quick actions to take now" column of the manager section.
 */
export const leaderActionSteps = [
  "Share this page with a team member who's ready for their next step.",
  "Ask 'What are you learning right now?' in your next team meeting.",
  "Encourage colleagues to build a Diploma into their development plans.",
  "Set aside 20 minutes to explore the learning pathways together.",
];

export const roles: Role[] = [
  {
    id: "frontline",
    level: 0,
    label: "Frontline Colleague",
    overview:
      "You're the heartbeat of the hotel – delivering memorable guest experiences every day. This is where great hospitality careers begin.",
    nextStep:
      "Supervisor – lead shifts and take responsibility for day-to-day operations.",
    // Links to the Colleague Learning Guide (URL to be supplied by IHG).
    resources: [{ title: "Role related learning" }],
  },
  {
    id: "supervisor",
    level: 1,
    label: "Supervisor",
    overview:
      "You guide a team through daily operations, set the standard for guest service and help your colleagues grow.",
    nextStep: "Manager – take ownership of team performance, goals and results.",
    resources: [],
  },
  {
    id: "manager",
    level: 2,
    label: "Manager",
    overview:
      "You set goals, develop your team and drive performance across your department. Your decisions help shape the culture and results of your department.",
    nextStep: "Senior Manager – lead larger teams and think beyond the everyday.",
    resources: [],
  },
  {
    id: "senior_manager",
    level: 3,
    label: "Senior Manager",
    overview:
      "You lead with influence – thinking commercially, inspiring your team through change, and connecting the dots between daily operations and long-term hotel success.",
    nextStep:
      "General Manager – grow teams and the business for long-term impact.",
    resources: [],
  },
  {
    id: "general_manager",
    level: 4,
    label: "General Manager",
    overview:
      "You set the vision, own the results and build the culture that makes your hotel exceptional. Your leadership touches every team member and every guest experience.",
    nextStep:
      "Expand your impact within IHG, whether that means working at a bigger hotel, a different brand, across multiple properties or in regional leadership.",
    resources: [
      {
        title: "General Manager Programme",
        description:
          "ongoing professional development to grow in your current role or work towards a new one.",
      },
    ],
  },
];

export const personas: Persona[] = [
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
export const personaQualifyingQuestions: PersonaQualifyingQuestion[] = [
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

const CORE_SUGGESTION = "core pathway towards your next role.";

/**
 * Each programme has `type`: "core" (Journey to... eLearning) or "advanced"
 * (accredited diplomas). UI uses this for CTAs and the manager conversation.
 */
export const programmes: Programme[] = [
  {
    id: "journey_supervisor",
    type: "core",
    levels: [0, 1],
    title: "Journey to Supervisor",
    description:
      "A self-directed eLearning programme to build essential skills and confidence to lead a team for the first time.",
    suggestionLine: CORE_SUGGESTION,
    whoItsFor:
      "New or aspiring supervisors in IHG hotels who are stepping into a leadership role for the first time.",
    outcomes:
      "Practical tools for managing performance, delegating effectively and leading your team with confidence.",
    relatedProgrammeIds: [],
    resources: [{ title: "Colleague Learning Guide" }],
    faqs: [],
  },
  {
    id: "journey_manager",
    type: "core",
    levels: [1, 2],
    title: "Journey to Manager",
    description:
      "A self-directed eLearning programme with 12 lessons across management fundamentals, team development and coaching.",
    suggestionLine: CORE_SUGGESTION,
    whoItsFor:
      "New or developing managers in IHG hotels who are ready to deepen their leadership skills and shift their focus from doing to leading.",
    outcomes:
      "Practical skills in goal-setting, delegation, performance management, feedback, motivation and coaching.",
    relatedProgrammeIds: ["hospitality_diploma_4", "journey_manager"],
    resources: [],
    faqs: [],
  },
  {
    id: "journey_senior_manager",
    type: "core",
    levels: [2, 3],
    title: "Journey to Senior Manager",
    description:
      "A self-directed eLearning programme with four modules to help you build emotional intelligence, commercial thinking, coaching skills and the ability to connect and inspire teams.",
    suggestionLine: CORE_SUGGESTION,
    whoItsFor:
      "Experienced managers in IHG hotels who are ready to take on broader leadership responsibility and develop the skills of a senior leader.",
    outcomes:
      "Senior leadership skills that allow you to lead through change, make commercial decisions confidently and build trust and alignment across your hotel.",
    relatedProgrammeIds: ["hospitality_diploma_5", "journey_senior_manager"],
    resources: [],
    faqs: [],
  },
  {
    id: "journey_gm",
    type: "core",
    levels: [3, 4],
    title: "Journey to General Manager",
    description:
      "A focused learning playlist designed to prepare leaders for the most critical leadership role in a hotel.",
    suggestionLine: CORE_SUGGESTION,
    whoItsFor: "Experienced leaders wanting to prepare for a General Manager role.",
    outcomes:
      "The confidence to lead a hotel with the ability to balance commercial, people and brand priorities to deliver impact at the enterprise level.",
    relatedProgrammeIds: ["journey_gm"],
    resources: [],
    faqs: [],
  },
  {
    id: "hospitality_diploma_3",
    type: "advanced",
    levels: [0, 1],
    title: "Foundational Diploma of Hospitality Leadership",
    fullTitle: "Foundational Diploma of Hospitality Leadership (Level 3)",
    description:
      "An accredited, blended learning programme with six live virtual modules leading to an internationally recognised qualification.",
    suggestionLine: "accredited qualification to develop leadership skills.",
    whoItsFor:
      "Supervisors in IHG hotels who are ready to deepen their leadership skills through structured, facilitated learning.",
    outcomes:
      "A formal accredited qualification covering six deeply practical modules including performance coaching, team optimisation, collaboration, change management, goal-setting and talent development.",
    recommendation:
      "This programme is ideal if you are currently in a supervisory role and have completed, or are working through, the tools learned in Journey to Supervisor. It is best taken when you have a team to lead, so you can apply your learning directly in your role.",
    faqs: [
      {
        question: "Am I ready for the Foundational Diploma?",
        answer:
          "Readiness for Foundational Diploma of Hospitality Leadership depends on your current responsibilities and whether you can commit to the programme alongside your role. Be direct with your manager about strengths, gaps, and whether timing fits team priorities — they can help you judge formal readiness.",
      },
      {
        question: "What is the time commitment for each module?",
        answer:
          "The Foundational Diploma is designed to be applied, not rushed. Each module combines formal learning with time to practise and embed new skills in your role. For this reason, we recommend allowing approximately 1-2 months per module, giving yourself space to apply the learning on the job and build sustainable leadership habits.",
      },
      {
        question: "Will I receive a certificate on completion?",
        answer:
          "Yes, you will receive a Level 3 Diploma of Hospitality Leadership from the Confederation of Tourism and Hospitality.",
      },
    ],
    quote:
      "This programme completely changed how I approach conversations with my team. I now have real tools, not just instincts.",
    quoteAuthor: "Housekeeping Supervisor, Holiday Inn, Dubai",
    relatedProgrammeIds: ["journey_supervisor", "hospitality_diploma_3"],
    resources: [],
  },
  {
    id: "hospitality_diploma_4",
    type: "advanced",
    levels: [1, 2],
    title: "Diploma of Hospitality Leadership",
    fullTitle: "Diploma of Hospitality Leadership (Level 4)",
    description:
      "An accredited, blended learning qualification with six live virtual modules that take managers deeper into the leadership capabilities that drive hotel performance.",
    suggestionLine: "accredited qualification to help you lead as a manager.",
    whoItsFor:
      "Managers in IHG hotels who are ready to formalise their leadership development and earn a recognised qualification.",
    outcomes:
      "An internationally recognised management-level qualification and advanced skills across performance coaching, team optimisation, change management, talent development, collaboration strategies and goal and resource management – applied to the real challenges of hotel management.",
    recommendation:
      "This programme is designed for managers who are actively leading teams and looking to formalise their development. It works best alongside or after completing Journey to Manager and is ideal for those considering a step up to senior management.",
    faqs: [
      {
        question: "Am I ready for the Diploma?",
        answer:
          "Readiness for Diploma of Hospitality Leadership depends on your current responsibilities and whether you can commit to the programme alongside your role. Be direct with your manager about strengths, gaps, and whether timing fits team priorities – they can help you judge formal readiness.",
      },
      {
        question:
          "What is the difference between the Foundational and the Diploma?",
        answer:
          "The Foundational Diploma (Level 3) introduces key leadership tools, while the Diploma (Level 4) is about putting those tools into practice in your managerial role and building confidence through real‑world application.",
      },
      {
        question: "How is the programme assessed?",
        answer:
          "You’ll attend each module’s virtual instructor-led session and complete the related section of your Diploma essay. At the end of the programme, all six essays are submitted together for marking to achieve your accreditation. Your manager also needs to see these new skills being applied in your day-to-day role.",
      },
    ],
    quote:
      "The Diploma gave me a framework for everything I was already doing intuitively. I came away a more confident, more deliberate leader.",
    quoteAuthor: "Duty Manager, Crowne Plaza, Changi Airport Singapore",
    relatedProgrammeIds: ["journey_manager", "hospitality_diploma_4"],
    resources: [],
  },
  {
    id: "hospitality_diploma_5",
    type: "advanced",
    levels: [2, 3, 4],
    title: "Advanced Diploma of Hospitality Leadership",
    fullTitle: "Advanced Diploma of Hospitality Leadership (Level 5)",
    description:
      "An accredited learning programme to enable senior hospitality leaders to lead complex hotel operations and drive sustained business performance.",
    suggestionLine:
      "accredited qualification to elevate your leadership at a senior level.",
    whoItsFor:
      "Heads of Departments, EXCOM, Directors or 2IC leaders who are ready to be tested in applying their leadership tools in real world hotel environments. You must have completed Journey to Senior Manager.",
    outcomes:
      "An internationally recognised senior leadership qualification, building advanced capabilities in strategic thinking, commercial and operational leadership, leading through others, driving change, and influencing stakeholders — applied to the complex, real-world challenges of leading hotels at scale.",
    recommendation:
      "If you are already leading through others and want to sharpen your strategic, commercial and leadership capability in a way that is recognised and immediately relevant to your role, this programme is likely to be the right next step.",
    faqs: [
      {
        question: "Am I ready to commit?",
        answer:
          "Consider whether you are in a position to apply your learning in real time within your role, and whether you have the support of your manager to prioritise this development. It is equally important to reflect on whether you are ready to be challenged, to reflect on your leadership approach and to stretch how you operate.",
      },
      {
        question: "Is it aligned to your personal development plan?",
        answer:
          "Take time to consider how this programme aligns with your existing development goals and priorities. Reflect on whether it supports the capabilities you and your manager have identified for your next step, and how it complements other learning or experiences already included in your development plan.",
      },
      {
        question: "What impact am I trying to achieve?",
        answer:
          "Use this as an opportunity to clarify the broader business impact you are expected to deliver over the next 12-24 months. You may also want to consider whether you are preparing for a General Manager or equivalent senior leadership role, and how this programme will help you perform more effectively in your current role.",
      },
    ],
    // Placeholder testimonial: to be supplied by IHG.
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    quoteAuthor: "Lorem Ipsum, Hotel Name, City",
    relatedProgrammeIds: ["journey_senior_manager", "hospitality_diploma_5"],
    resources: [],
  },
];

export const stories: Story[] = [
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

const coreJourneyByRoleId: Record<string, string> = {
  frontline: "journey_supervisor",
  supervisor: "journey_manager",
  manager: "journey_senior_manager",
  senior_manager: "journey_gm",
};

const diplomaByRoleId: Record<string, string> = {
  supervisor: "hospitality_diploma_3",
  manager: "hospitality_diploma_4",
  senior_manager: "hospitality_diploma_5",
};

export const faqs: Faq[] = [
  {
    id: "journey_free",
    question: "Are the Journey to... programmes really free?",
    answer: "Yes. All our Journey to... programmes are free.",
  },
  {
    id: "journey_vs_diploma",
    question:
      "What's the difference between the Journey to... programmes and the Diplomas?",
    answer:
      "Our Journey to... programmes are self-directed eLearning courses that allow you to build essential leadership skills at your own pace. The Diplomas are internationally recognised qualifications that include live instructor-led virtual sessions and assessments.",
  },
  {
    // Placeholder answer: to be supplied by IHG.
    id: "diploma_enrol",
    question: "How do I enrol in a Diploma programme?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    // Placeholder answer: to be supplied by IHG.
    id: "multiple_programmes",
    question: "Can I do more than one programme at the same time?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
];

/**
 * Returns relevant node IDs based on the user's role and goal
 */
export function getRelevantNodes(userContext: UserContext): string[] {
  return getActivePathState(userContext).highlightedNodeIds;
}

export function getNextRoleById(
  currentRoleId: string | null | undefined,
): Role | null {
  const currentRole = roles.find((r) => r.id === currentRoleId);
  if (!currentRole) return null;
  return roles.find((r) => r.level === currentRole.level + 1) ?? null;
}

export function getCoreJourneyForRole(
  currentRoleId: string | null | undefined,
): string | null {
  if (!currentRoleId) return null;
  return coreJourneyByRoleId[currentRoleId] ?? null;
}

export function getDiplomaForRole(
  currentRoleId: string | null | undefined,
): string | null {
  if (!currentRoleId) return null;
  return diplomaByRoleId[currentRoleId] ?? null;
}

function isForwardMapEdge(type: ConnectorType): boolean {
  return type === "core" || type === "diplomaPath";
}

/** Core journey programme id for this hotel role, if any. */
export function getRelevantCoreNodes(roleId: string): string[] {
  const j = getCoreJourneyForRole(roleId);
  return j ? [j] : [];
}

/** Value-add diploma node id for this hotel role, if any. */
export function getRelevantAdvancedNodes(roleId: string): string[] {
  const d = getDiplomaForRole(roleId);
  return d ? [d] : [];
}

/**
 * Soft-suggestion connector ids when a role is selected (core + diploma routes from this role).
 */
export function getRelevantPathsForRole(
  roleId: string,
  connectorList: MapConnector[] = MAP_CONNECTORS,
): string[] {
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
  roleId: string | null,
  nodeId: string | null,
  connectorList: MapConnector[] = MAP_CONNECTORS,
): string[] {
  if (!roleId || !nodeId || roleId === nodeId) return [];
  const edges = connectorList.filter((c) => isForwardMapEdge(c.type));
  const adj = new Map<string, { toId: string; id: string }[]>();
  for (const c of edges) {
    if (!adj.has(c.fromId)) adj.set(c.fromId, []);
    adj.get(c.fromId)!.push({ toId: c.toId, id: c.id });
  }
  const queue: [string, string[]][] = [[roleId, []]];
  const seen = new Set([roleId]);
  while (queue.length) {
    const [node, pathIds] = queue.shift()!;
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
export function getSupportingHighlightsForAdvanced(
  roleId: string | null,
  _diplomaId?: string | null,
): { nodeIds: string[]; connectionIds: string[] } {
  const journeyNodeId = getCoreJourneyForRole(roleId);
  const nextRoleId = getNextRoleById(roleId)?.id ?? null;
  const nodeIds = [journeyNodeId, nextRoleId].filter(
    (n): n is string => Boolean(n),
  );
  const connectionIds: string[] = [];
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
  programmeId: string,
  connectorList: MapConnector[] = MAP_CONNECTORS,
): string | null {
  const incoming = connectorList.find(
    (c) =>
      isForwardMapEdge(c.type) &&
      c.toId === programmeId &&
      roles.some((r) => r.id === c.fromId),
  );
  return incoming?.fromId ?? null;
}

/** Node ids to softly emphasise when a role is selected (suggest state). */
export function getSuggestHighlightNodeIds(roleId: string): string[] {
  const nextRoleId = getNextRoleById(roleId)?.id ?? null;
  const journeyId = getCoreJourneyForRole(roleId);
  const diplomaId = getDiplomaForRole(roleId);
  return [
    ...new Set(
      [roleId, nextRoleId, journeyId, diplomaId].filter(
        (n): n is string => Boolean(n),
      ),
    ),
  ];
}

/**
 * Nodes that should stay visible (not heavily faded) when a programme is committed.
 */
export function getCommittedHighlightNodeIds(
  roleId: string | null,
  selectedNodeId: string | null,
  selectedNodeType: NodeType | null,
): string[] {
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
  roleId: string | null,
  selectedNodeId: string | null,
  selectedNodeType: NodeType | null,
): string[] {
  if (selectedNodeType !== "advanced") return [];
  if (!selectedNodeId?.startsWith("hospitality_diploma")) return [];
  return getSupportingHighlightsForAdvanced(roleId, selectedNodeId).connectionIds;
}

/** Persona narrowing for soft highlights: extend when persona→node mapping exists. */
export function intersectSuggestNodesWithPersona(
  softNodeIds: string[],
  _selectedPersonaId?: string | null,
): string[] {
  return softNodeIds;
}

/**
 * Connector IDs for map focus highlighting: **forward-only** path (vector, not full network).
 * Role: role → core journey → next role; if mapMode is exploreNext, adds role → diploma → next role.
 * Journey / diploma: forward outgoing steps only (no incoming “past” edges).
 */
export function getForwardConnectorIdsForFocus(
  focusId: string | null,
  mapMode: MapMode | null,
  connectorList: MapConnector[] | null | undefined,
): Set<string> {
  const out = new Set<string>();
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
export function getPastRoleIds(currentRoleId: string | null): string[] {
  const current = roles.find((r) => r.id === currentRoleId);
  if (!current) return [];
  return roles.filter((r) => r.level < current.level).map((r) => r.id);
}

/**
 * Returns the active path model for map highlighting and connector styling.
 */
export function getActivePathState(
  userContext: UserContext | null | undefined,
): ActivePathState {
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

  const diplomaConnectorIds: string[] = [];
  if (diplomaNodeId) diplomaConnectorIds.push(`${currentRoleId}->${diplomaNodeId}`);
  if (diplomaNodeId && nextRoleId) diplomaConnectorIds.push(`${diplomaNodeId}->${nextRoleId}`);

  const fullCoreConnectorIds: string[] = [];
  if (journeyNodeId) fullCoreConnectorIds.push(`${currentRoleId}->${journeyNodeId}`);
  if (journeyNodeId && nextRoleId) fullCoreConnectorIds.push(`${journeyNodeId}->${nextRoleId}`);

  const fallbackConnectorIds: string[] = [];
  if (journeyNodeId && currentRoleId) fallbackConnectorIds.push(`${journeyNodeId}->${currentRoleId}`);

  let highlightedNodeIds: string[] = [];
  let softHighlightNodeIds: string[] = [];
  let activeCoreConnectorIds: string[] = [];

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

/** Display title for any map node (role label or programme title). */
export function getNodeTitle(nodeId: string | null | undefined): string | null {
  if (!nodeId) return null;
  return getProgrammeById(nodeId)?.title ?? getRoleById(nodeId)?.label ?? null;
}

/**
 * Deterministic “development case” copy for manager conversations (advanced programmes).
 * Uses only fields from the content model — no API or randomness.
 */
export function buildDevelopmentCase({
  programme,
  currentRoleId,
  selectedPersonaId,
}: {
  programme: Programme | null | undefined;
  currentRoleId?: string | null;
  selectedPersonaId?: string | null;
}): DevelopmentCase | null {
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

  const audience = programme.whoItsFor?.trim().replace(/[.\s]+$/, "");
  const whyFits = audience
    ? `${programme.title} is designed for: ${audience}. A strong match as you move from ${currentLabel} toward ${nextLabel}.${personaClause}`
    : `${programme.title} supports your move from ${currentLabel} toward ${nextLabel}.${personaClause}`;

  const whatYouGain = programme.outcomes?.trim()
    ? [programme.outcomes.trim()]
    : [];

  return {
    currentPosition: `You are currently a ${currentLabel} preparing for ${nextLabel}.`,
    nextStep: `This programme supports your transition to ${nextLabel}.`,
    whyFits,
    whatYouGain,
  };
}

/** First sentence (up to “. ”) for short role overview copy. */
export function overviewLead(overview: string | null | undefined): string {
  const o = overview?.trim() ?? "";
  if (!o) return "";
  const i = o.indexOf(". ");
  return i > 0 ? o.slice(0, i + 1) : o;
}

/** One-line summary for programmes (map tooltips). */
export function programmeRelevanceLine(
  programme: Programme | null | undefined,
): string {
  return programme?.description?.trim() ?? "";
}

/** Get programme by id. */
export function getProgrammeById(
  id: string | null | undefined,
): Programme | null {
  if (!id) return null;
  return programmes.find((p) => p.id === id) ?? null;
}

/**
 * Get story by id.
 */
export function getStoryById(id: string | null | undefined): Story | null {
  if (!id) return null;
  return stories.find((s) => s.id === id) ?? null;
}

/**
 * Get role label by id.
 */
export function getRoleLabel(roleId: string): string {
  return roles.find((r) => r.id === roleId)?.label ?? roleId;
}

/**
 * Get full role by id (includes overview, quote, quoteAuthor).
 */
export function getRoleById(id: string | null | undefined): Role | null {
  if (!id) return null;
  return roles.find((r) => r.id === id) ?? null;
}
