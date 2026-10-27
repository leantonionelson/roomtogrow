/**
 * The complete SiteContent bundle, built from the in-repo content model.
 * Copy changes go in `data/contentModel.ts` and ship with the build.
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

export const siteContent: SiteContent = {
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
