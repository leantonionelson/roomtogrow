/**
 * Static fallback content: the complete SiteContent bundle built from the
 * in-repo content model. Used at first render and whenever the CMS is
 * unreachable (important on an intranet where the CMS host may be blocked).
 */
import type { SiteContent } from "../types/content";
import {
  faqs,
  intentSelector,
  introBlock,
  leaderActionSteps,
  managerGuidance,
  pathAiConfig,
  personaQualifyingQuestions,
  personas,
  programmes,
  roles,
  sellingPoints,
  stories,
  strapline,
} from "../data/contentModel";

export const fallbackContent: SiteContent = {
  strapline,
  introBlock,
  intentSelector,
  pathAiConfig,
  sellingPoints,
  managerGuidance,
  leaderActionSteps,
  roles,
  personas,
  personaQualifyingQuestions,
  programmes,
  stories,
  faqs,
};
