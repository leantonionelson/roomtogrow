/**
 * The complete SiteContent bundle per locale: the English content model with
 * a locale's translated copy laid over it (content/translations). Copy
 * changes go in `data/contentModel.ts` (English) and the translation files,
 * and ship with the build.
 */
import type { LearningResource, SiteContent } from "../types/content";
import type { Locale } from "../i18n/locale";
import type { ContentTranslation, ResourceText } from "./translations/types";
import { fr } from "./translations/fr";
import { es } from "./translations/es";
import { ar } from "./translations/ar";
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

const TRANSLATIONS: Partial<Record<Locale, ContentTranslation>> = { fr, es, ar };

/** A translated list replaces the English one only if it lines up item for item. */
function sameLength<T>(base: T[], translated: T[] | undefined): T[] {
  return translated && translated.length === base.length ? translated : base;
}

function mergeResources(
  base: LearningResource[],
  translated: ResourceText[] | undefined,
): LearningResource[] {
  return base.map((r, i) => ({ ...r, ...translated?.[i] }));
}

function translate(tr: ContentTranslation): SiteContent {
  return {
    ...siteContent,
    strapline: tr.strapline,
    introBlock: tr.introBlock,
    intentSelector: {
      question: tr.intentSelector.question,
      microcopy: tr.intentSelector.microcopy,
      options: intentSelector.options.map((o) => ({
        ...o,
        label: tr.intentSelector.options[o.value] ?? o.label,
      })),
    },
    sellingPoints: sameLength(sellingPoints, tr.sellingPoints),
    managerGuidance: sameLength(managerGuidance, tr.managerGuidance),
    leaderActionSteps: sameLength(leaderActionSteps, tr.leaderActionSteps),
    roles: roles.map((r) => {
      const t = tr.roles[r.id];
      return t
        ? { ...r, ...t, resources: mergeResources(r.resources, t.resources) }
        : r;
    }),
    programmes: programmes.map((p) => {
      const t = tr.programmes[p.id];
      if (!t) return p;
      return {
        ...p,
        ...t,
        title: t.title ?? p.title,
        fullTitle: t.fullTitle ?? p.fullTitle,
        faqs: sameLength(p.faqs, t.faqs),
        quote: t.quote ?? p.quote,
        quoteAuthor: t.quoteAuthor ?? p.quoteAuthor,
        resources: mergeResources(p.resources, t.resources),
      };
    }),
    faqs: faqs.map((f) => ({ ...f, ...tr.faqs[f.id] })),
  };
}

const cache = new Map<Locale, SiteContent>();

/** Site content in the given locale (English for anything not translated). */
export function getSiteContent(locale: Locale): SiteContent {
  const tr = TRANSLATIONS[locale];
  if (!tr) return siteContent;
  let content = cache.get(locale);
  if (!content) {
    content = translate(tr);
    cache.set(locale, content);
  }
  return content;
}
