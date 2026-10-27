import type {
  IntentValue,
  IntroBlock,
  ProgrammeFaq,
  SellingPoint,
  Strapline,
} from "../../types/content";

/** Text of a learning resource (its URL stays in the English model). */
export interface ResourceText {
  title: string;
  description?: string;
}

/**
 * Translated campaign copy for one locale. Text only: ids, levels, links and
 * relationships stay in `data/contentModel.ts`. Lists line up with the
 * English lists by position; roles, programmes and FAQs are keyed by id.
 * Anything left out falls back to English.
 */
export interface ContentTranslation {
  strapline: Strapline;
  introBlock: IntroBlock;
  intentSelector: {
    question: string;
    microcopy: string;
    options: Partial<Record<IntentValue, string>>;
  };
  sellingPoints: SellingPoint[];
  managerGuidance: string[];
  leaderActionSteps: string[];
  roles: Record<
    string,
    { label: string; overview: string; nextStep: string; resources?: ResourceText[] }
  >;
  programmes: Record<
    string,
    {
      /** Official programme names; omit to keep the English (LMS) name. */
      title?: string;
      fullTitle?: string;
      description: string;
      suggestionLine: string;
      whoItsFor: string;
      outcomes: string;
      recommendation?: string;
      faqs?: ProgrammeFaq[];
      quote?: string;
      quoteAuthor?: string;
      resources?: ResourceText[];
    }
  >;
  faqs: Record<string, { question: string; answer: string }>;
}
