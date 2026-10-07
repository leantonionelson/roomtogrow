/**
 * Domain types for the Room to Grow / Growth Navigator content model.
 * These mirror the Payload CMS collections and globals; the static fallback
 * content and the CMS fetch layer both conform to these shapes.
 */

/** Map interaction mode: immediate learning vs next-step exploration. */
export type MapMode = "startNow" | "exploreNext";

export type ConnectorType = "core" | "diplomaPath" | "fallback";

export interface MapConnector {
  id: string;
  fromId: string;
  toId: string;
  type: ConnectorType;
}

/** A node on the map is a role, a core journey programme, or an advanced programme. */
export type NodeType = "role" | "core" | "advanced";

/**
 * A learning link that isn't a node on the map (e.g. the Colleague Learning
 * Guide or the General Manager Programme). With a description it is also
 * listed under the role's suggested programmes.
 */
export interface LearningResource {
  title: string;
  description?: string;
  url?: string;
}

export interface Role {
  id: string;
  /** 0 = frontline … 4 = general manager; drives pyramid tiers. */
  level: number;
  label: string;
  /** "Your current role" description in the sidebar. */
  overview: string;
  /** "Your next step" copy. */
  nextStep: string;
  resources: LearningResource[];
}

export interface Persona {
  id: string;
  label: string;
  description: string;
  panelFocusSelf: string;
  panelFocusLeader: string;
}

export interface PersonaQualifyingOption {
  label: string;
  personaId: string;
}

export interface PersonaQualifyingQuestion {
  id: string;
  question: string;
  options: PersonaQualifyingOption[];
}

export type ProgrammeType = "core" | "advanced";

export interface ProgrammeFaq {
  question: string;
  answer: string;
}

export interface Programme {
  id: string;
  type: ProgrammeType;
  /** Role levels this programme spans on the map. */
  levels: number[];
  /** Short title used on the map and in buttons. */
  title: string;
  /** Panel heading when it differs from `title` (e.g. with the diploma level). */
  fullTitle?: string;
  /** Short description: panel intro and map tooltip. */
  description: string;
  /** Line shown after the title in a role's "Suggested programmes" list. */
  suggestionLine: string;
  whoItsFor: string;
  /** "What you'll gain". */
  outcomes: string;
  /** Start now (core) / Enrol now (diploma) link. */
  ctaUrl?: string;
  /** Learn more (core) / Find out more (diploma) link. */
  moreInfoUrl?: string;
  /** Related learning: programme ids on the map, in display order. */
  relatedProgrammeIds: string[];
  /** Related learning that lives outside the map. */
  resources: LearningResource[];
  /** Diplomas: "Is this right for me?" guidance. */
  recommendation?: string;
  /** Diplomas: questions shown under "Talk to your manager". */
  faqs: ProgrammeFaq[];
  quote?: string;
  quoteAuthor?: string;
  /** "Read more" link under the testimonial. */
  quoteUrl?: string;
}

export interface Story {
  id: string;
  name: string;
  pathDescription: string;
  shortStory: string;
}

export interface Faq {
  id: string;
  question: string;
  /** Empty until the client supplies it; unanswered FAQs are not shown. */
  answer: string;
}

export interface Strapline {
  headline: string;
  intro: string;
}

export interface IntroBlock {
  /** Section headline. */
  internalComms: string;
  ihgUniversityExplanation: string;
  /** Optional closing line. */
  journeyStartsHere?: string;
}

export interface SellingPoint {
  title: string;
  body: string;
}

export type IntentValue = "selfGrowth" | "developingTeam" | "learnAbout";

export interface IntentOption {
  value: IntentValue;
  label: string;
}

export interface IntentSelectorContent {
  question: string;
  microcopy: string;
  options: IntentOption[];
}

export interface PathAiConfig {
  sectionTitle: string;
  inputPlaceholder: string;
  quickPrompts: string[];
}

/** The user's current selections driving map highlighting. */
export interface UserContext {
  currentRoleId: string | null;
  mapMode?: MapMode;
}

/** Derived path model for map highlighting and connector styling. */
export interface ActivePathState {
  currentRoleId: string | null;
  mapMode: MapMode | null;
  nextRoleId: string | null;
  journeyNodeId: string | null;
  diplomaNodeId: string | null;
  highlightedNodeIds: string[];
  softHighlightNodeIds: string[];
  coreConnectorIds: string[];
  activeCoreConnectorIds: string[];
  diplomaConnectorIds: string[];
  fallbackConnectorIds: string[];
}

/** Deterministic "development case" copy for manager conversations. */
export interface DevelopmentCase {
  currentPosition: string;
  nextStep: string;
  whyFits: string;
  whatYouGain: string[];
}

/**
 * The complete content bundle the UI renders from.
 * Served by the CMS; the static fallback provides the same shape.
 */
export interface SiteContent {
  strapline: Strapline;
  introBlock: IntroBlock;
  intentSelector: IntentSelectorContent;
  pathAiConfig: PathAiConfig;
  sellingPoints: SellingPoint[];
  managerGuidance: string[];
  leaderActionSteps: string[];
  roles: Role[];
  personas: Persona[];
  personaQualifyingQuestions: PersonaQualifyingQuestion[];
  programmes: Programme[];
  stories: Story[];
  faqs: Faq[];
}
