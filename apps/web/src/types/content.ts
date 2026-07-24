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

export interface Role {
  id: string;
  /** 0 = frontline … 4 = general manager; drives pyramid tiers. */
  level: number;
  label: string;
  overview: string;
  quote: string;
  quoteAuthor: string;
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

export interface Programme {
  id: string;
  type: ProgrammeType;
  /** Role levels this programme spans on the map. */
  levels: number[];
  title: string;
  mapSummary: string;
  leadsTo: string;
  whoItsFor: string;
  skillsDeveloped: string;
  whatToExpect: string;
  timeCommitment: string;
  nextStep: string;
  whyChooseThis?: string;
  quote?: string;
  quoteAuthor?: string;
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
  answer: string;
}

export interface Strapline {
  headline: string;
  intro: string;
}

export interface IntroBlock {
  internalComms: string;
  ihgUniversityExplanation: string;
  journeyStartsHere: string;
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

/** Structured panel context for a selected map node. */
export interface NodeContext {
  title: string;
  type: NodeType;
  whoItsFor: string;
  whatItHelpsWith: string;
  whatItLeadsTo: string;
  whyChooseThis?: string;
  quote?: string;
  quoteAuthor?: string;
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
  sellingPoints: string[];
  managerGuidance: string[];
  leaderActionSteps: string[];
  roles: Role[];
  personas: Persona[];
  personaQualifyingQuestions: PersonaQualifyingQuestion[];
  programmes: Programme[];
  stories: Story[];
  faqs: Faq[];
}
