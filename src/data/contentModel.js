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
  selfGrowth: "Start where you are. See where you could go.",
  developingTeam: "See how to help someone take their next step.",
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
    label: "Frontline colleague",
    overview:
      "Frontline colleagues deliver our guest experience every day—whether in rooms, food and beverage, or front desk. This is where many growth journeys start, with hands-on experience and pathways into supervision and beyond.",
    quote:
      "I started on the front desk. Room to Grow helped me see that my next step was within reach.",
    quoteAuthor: "Frontline colleague, UK",
  },
  {
    id: "supervisor",
    label: "Supervisor",
    overview:
      "Supervisors lead a small team or shift, supporting day-to-day operations and developing their first leadership skills. It's the first step into people leadership and a bridge to management.",
    quote:
      "Becoming a supervisor was the moment I realised I could grow without leaving what I love—hospitality.",
    quoteAuthor: "Supervisor, Europe",
  },
  {
    id: "manager",
    label: "Manager",
    overview:
      "Managers lead a team or department, with responsibility for performance, development, and delivery. They balance operational excellence with people leadership and are key to developing the next generation of leaders.",
    quote:
      "As a manager, I'm not just running the department—I'm helping my team see their own routes to grow.",
    quoteAuthor: "Manager, IHG",
  },
  {
    id: "senior_manager",
    label: "Senior Manager",
    overview:
      "Senior managers lead larger teams or multiple areas, often with broader business or regional responsibility. They shape strategy, drive change, and develop other managers—a critical step toward general management.",
    quote:
      "The jump to senior manager was about thinking beyond my patch. Room to Grow showed me the programmes that got me there.",
    quoteAuthor: "Senior Manager",
  },
  {
    id: "general_manager",
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
    title: "Journey to Supervisor",
    whoItsFor: "Frontline colleagues ready to step into a first leadership role.",
    skillsDeveloped: "Delegation, team coordination, basic people management.",
    whatToExpect: "Blended learning with practical application in your role.",
    timeCommitment: "Flexible over 4–6 weeks.",
    nextStep: "Discuss with your manager and enrol via IHG University.",
  },
  {
    id: "journey_manager",
    title: "Journey to Manager",
    whoItsFor: "Supervisors aiming to become managers.",
    skillsDeveloped: "Performance management, planning, stakeholder communication.",
    whatToExpect: "Structured programme with workshops and on-the-job projects.",
    timeCommitment: "Flexible over 8–12 weeks.",
    nextStep: "Complete Journey to Supervisor and apply for Journey to Manager.",
  },
  {
    id: "journey_senior_manager",
    title: "Journey to Senior Manager",
    whoItsFor: "Managers preparing for senior leadership.",
    skillsDeveloped: "Strategy, change management, leading managers.",
    whatToExpect: "Leadership modules and business projects.",
    timeCommitment: "Flexible over 12–16 weeks.",
    nextStep: "Complete Journey to Manager and discuss with your GM.",
  },
  {
    id: "journey_gm",
    title: "Journey to General Manager",
    whoItsFor: "Senior managers ready for GM roles.",
    skillsDeveloped: "P&L, property leadership, commercial and people strategy.",
    whatToExpect: "Executive-level development and mentoring.",
    timeCommitment: "Flexible over 6–12 months.",
    nextStep: "Apply through your regional leadership team.",
  },
  {
    id: "core_leadership",
    title: "Core Leadership Learning",
    whoItsFor: "Anyone in or moving into a people-leading role.",
    skillsDeveloped: "Core leadership essentials, feedback, coaching.",
    whatToExpect: "Bite-sized modules and practical tools.",
    timeCommitment: "Ongoing; pick what fits your schedule.",
    nextStep: "Browse modules in IHG University.",
  },
  {
    id: "leadership_diplomas",
    title: "Leadership Diplomas",
    whoItsFor: "Managers and senior managers seeking formal recognition.",
    skillsDeveloped: "Leadership theory and practice at diploma level.",
    whatToExpect: "Accredited learning with assessment.",
    timeCommitment: "Varies by level; typically 6–12 months.",
    nextStep: "Check eligibility and apply via IHG University.",
  },
  {
    id: "hospitality_diploma_3",
    title: "Hospitality Diploma Level 3",
    whoItsFor: "Frontline and supervisory colleagues.",
    skillsDeveloped: "Hospitality operations, customer service, team support.",
    whatToExpect: "Industry-recognised qualification.",
    timeCommitment: "Flexible; typically 6–12 months.",
    nextStep: "Enrol through your property or regional L&D contact.",
  },
  {
    id: "hospitality_diploma_4",
    title: "Hospitality Diploma Level 4",
    whoItsFor: "Supervisors and managers.",
    skillsDeveloped: "Management and leadership in hospitality.",
    whatToExpect: "Higher-level operational and leadership skills.",
    timeCommitment: "Flexible; typically 12–18 months.",
    nextStep: "Complete Level 3 or meet entry requirements.",
  },
  {
    id: "hospitality_diploma_5",
    title: "Hospitality Diploma Level 5",
    whoItsFor: "Managers and senior managers.",
    skillsDeveloped: "Strategic and senior leadership in hospitality.",
    whatToExpect: "Strategic leadership qualification.",
    timeCommitment: "Flexible; typically 18–24 months.",
    nextStep: "Discuss with your GM or regional L&D.",
  },
];

/**
 * Route steps: alternating role and optional programme.
 * Step: { type: 'role' | 'programme', roleId?, programmeId?, label }
 */
function buildSteps(fromRoleId, toRoleId) {
  const roleOrder = ["frontline", "supervisor", "manager", "senior_manager", "general_manager"];
  const fromIdx = roleOrder.indexOf(fromRoleId);
  const toIdx = roleOrder.indexOf(toRoleId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) return [];

  const steps = [];
  const programmeMap = {
    frontline_supervisor: "journey_supervisor",
    supervisor_manager: "journey_manager",
    manager_senior_manager: "journey_senior_manager",
    senior_manager_general_manager: "journey_gm",
  };
  const roleLabels = Object.fromEntries(roles.map((r) => [r.id, r.label]));
  const programmeTitles = Object.fromEntries(programmes.map((p) => [p.id, p.title]));

  for (let i = fromIdx; i <= toIdx; i++) {
    const roleId = roleOrder[i];
    steps.push({
      type: "role",
      roleId,
      programmeId: null,
      id: `role_${roleId}`,
      label: roleLabels[roleId] ?? roleId,
    });
    if (i < toIdx) {
      const key = `${roleOrder[i]}_${roleOrder[i + 1]}`;
      const programmeId = programmeMap[key] || null;
      if (programmeId) {
        steps.push({
          type: "programme",
          roleId: null,
          programmeId,
          id: `programme_${programmeId}`,
          label: programmeTitles[programmeId] ?? programmeId,
        });
      }
    }
  }
  return steps;
}

export const routes = [
  {
    id: "r1",
    fromRoleId: "frontline",
    toRoleId: "supervisor",
    steps: buildSteps("frontline", "supervisor"),
    estimatedSteps: 2,
    timeStyle: "flexible",
  },
  {
    id: "r2",
    fromRoleId: "frontline",
    toRoleId: "manager",
    steps: buildSteps("frontline", "manager"),
    estimatedSteps: 4,
    timeStyle: "flexible",
  },
  {
    id: "r3",
    fromRoleId: "frontline",
    toRoleId: "senior_manager",
    steps: buildSteps("frontline", "senior_manager"),
    estimatedSteps: 6,
    timeStyle: "flexible",
  },
  {
    id: "r4",
    fromRoleId: "frontline",
    toRoleId: "general_manager",
    steps: buildSteps("frontline", "general_manager"),
    estimatedSteps: 8,
    timeStyle: "flexible",
  },
  {
    id: "r5",
    fromRoleId: "supervisor",
    toRoleId: "manager",
    steps: buildSteps("supervisor", "manager"),
    estimatedSteps: 2,
    timeStyle: "flexible",
  },
  {
    id: "r6",
    fromRoleId: "supervisor",
    toRoleId: "senior_manager",
    steps: buildSteps("supervisor", "senior_manager"),
    estimatedSteps: 4,
    timeStyle: "flexible",
  },
  {
    id: "r7",
    fromRoleId: "supervisor",
    toRoleId: "general_manager",
    steps: buildSteps("supervisor", "general_manager"),
    estimatedSteps: 6,
    timeStyle: "flexible",
  },
  {
    id: "r8",
    fromRoleId: "manager",
    toRoleId: "senior_manager",
    steps: buildSteps("manager", "senior_manager"),
    estimatedSteps: 2,
    timeStyle: "flexible",
  },
  {
    id: "r9",
    fromRoleId: "manager",
    toRoleId: "general_manager",
    steps: buildSteps("manager", "general_manager"),
    estimatedSteps: 4,
    timeStyle: "flexible",
  },
  {
    id: "r10",
    fromRoleId: "senior_manager",
    toRoleId: "general_manager",
    steps: buildSteps("senior_manager", "general_manager"),
    estimatedSteps: 2,
    timeStyle: "flexible",
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

export const faqs = [
  {
    id: "how_start",
    question: "How do I start?",
    answer:
      "Use the Growth Navigator above to choose your current role and where you want to go. Click Find Route to see your path, then explore the programmes on the map or in the Programme Explorer.",
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
 * Resolve a route from current and destination role IDs.
 */
export function getRoute(fromRoleId, toRoleId) {
  return routes.find((r) => r.fromRoleId === fromRoleId && r.toRoleId === toRoleId) ?? null;
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
