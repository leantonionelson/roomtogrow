/**
 * Mock content model for IHG Growth Navigator wireframe.
 * All campaign content is defined here; UI references this module only.
 */

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

/**
 * Contextual sentences shown above the map when a route is displayed.
 */
export const mapContextualSentences = {
  defaultPath: "You move forward through experience. Learning strengthens how you move.",
  accelerationPath: "You move forward through experience. Structured learning strengthens how you move.",
};

export const pathAiConfig = {
  sectionTitle: "Ask about this path",
  inputPlaceholder: "Ask how to move forward, what to expect, or where to focus",
  quickPrompts: [
    "What should I focus on first?",
    "What slows people down here?",
    "Am I ready?",
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

export const programmes = [
  {
    id: "journey_supervisor",
    type: "core",
    levels: [0, 1],
    title: "Journey to Supervisor",
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
    whoItsFor: "Frontline and supervisory colleagues.",
    skillsDeveloped: "Hospitality operations, customer service, team support.",
    whatToExpect: "Industry-recognised qualification.",
    timeCommitment: "Flexible; typically 6–12 months.",
    nextStep: "Enrol through your property or regional L&D contact.",
  },
  {
    id: "hospitality_diploma_4",
    type: "advanced",
    levels: [1, 2],
    title: "Diploma of Hospitality Leadership",
    whoItsFor: "Supervisors and managers.",
    skillsDeveloped: "Management and leadership in hospitality.",
    whatToExpect: "Higher-level operational and leadership skills.",
    timeCommitment: "Flexible; typically 12–18 months.",
    nextStep: "Complete Level 3 or meet entry requirements.",
  },
  {
    id: "hospitality_diploma_5",
    type: "advanced",
    levels: [2, 3, 4],
    title: "Advanced Diploma of Hospitality Leadership",
    whoItsFor: "Managers and senior managers.",
    skillsDeveloped: "Strategic and senior leadership in hospitality.",
    whatToExpect: "Strategic leadership qualification.",
    timeCommitment: "Flexible; typically 18–24 months.",
    nextStep: "Discuss with your GM or regional L&D.",
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
      "Use the Growth Navigator above to choose your current role and goal. Click 'Show my options' to see relevant possibilities.",
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

/**
 * Returns the active path model for map highlighting and connector styling.
 */
export function getActivePathState(userContext) {
  if (!userContext?.currentRoleId) {
    return {
      currentRoleId: null,
      nextRoleId: null,
      journeyNodeId: null,
      diplomaNodeId: null,
      highlightedNodeIds: [],
      coreConnectorIds: [],
      accelerationConnectorIds: [],
      fallbackConnectorIds: [],
    };
  }

  const currentRoleId = userContext.currentRoleId;
  const nextRoleId = getNextRoleById(currentRoleId)?.id ?? null;
  const journeyNodeId = getCoreJourneyForRole(currentRoleId);
  const diplomaNodeId = userContext.acceleration
    ? getDiplomaForRole(currentRoleId)
    : null;

  const highlightedNodeIds = [currentRoleId];
  if (nextRoleId) highlightedNodeIds.push(nextRoleId);
  if (journeyNodeId) highlightedNodeIds.push(journeyNodeId);
  if (diplomaNodeId) highlightedNodeIds.push(diplomaNodeId);

  const coreConnectorIds = [];
  if (journeyNodeId) coreConnectorIds.push(`${currentRoleId}->${journeyNodeId}`);
  if (journeyNodeId && nextRoleId) coreConnectorIds.push(`${journeyNodeId}->${nextRoleId}`);

  const accelerationConnectorIds = [];
  if (diplomaNodeId) accelerationConnectorIds.push(`${currentRoleId}->${diplomaNodeId}`);
  if (diplomaNodeId && nextRoleId) accelerationConnectorIds.push(`${diplomaNodeId}->${nextRoleId}`);

  const fallbackConnectorIds = [];
  if (journeyNodeId && currentRoleId) fallbackConnectorIds.push(`${journeyNodeId}->${currentRoleId}`);

  return {
    currentRoleId,
    nextRoleId,
    journeyNodeId,
    diplomaNodeId,
    highlightedNodeIds: [...new Set(highlightedNodeIds)],
    coreConnectorIds,
    accelerationConnectorIds,
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
      whatItLeadsTo: programme.nextStep
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
 * Get programme by id.
 */
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
