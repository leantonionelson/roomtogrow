/**
 * Typed fetch layer for the separately hosted Payload CMS.
 *
 * Maps Payload REST responses onto the SiteContent shape. Callers should
 * catch failures and fall back to `fallbackContent` — on an intranet the
 * CMS host may be slow or unreachable and the page must still render.
 */
import type {
  Faq,
  IntentSelectorContent,
  IntentValue,
  LearningResource,
  Persona,
  PersonaQualifyingQuestion,
  Programme,
  ProgrammeFaq,
  ProgrammeType,
  Role,
  SellingPoint,
  SiteContent,
  Story,
} from "../types/content";

const FETCH_TIMEOUT_MS = 6000;

interface PayloadListResponse<T> {
  docs: T[];
}

/** Payload array fields store strings as [{ text }] rows. */
type TextRow = { text: string };

interface SiteCopyGlobal {
  strapline: SiteContent["strapline"];
  introBlock: SiteContent["introBlock"];
  intentSelector: {
    question: string;
    microcopy: string;
    options: { value: IntentValue; label: string }[];
  };
  pathAiConfig: {
    sectionTitle: string;
    inputPlaceholder: string;
    quickPrompts: TextRow[];
  };
  sellingPoints: SellingPoint[];
  managerGuidance: TextRow[];
  leaderActionSteps: TextRow[];
  personaQualifier: {
    questions: {
      questionId: string;
      question: string;
      options: { label: string; personaSlug: string }[];
    }[];
  };
}

/** Payload returns `null` (not `undefined`) for empty optional fields. */
type Nullable<T> = T | null | undefined;

interface ResourceRow {
  title: string;
  description?: Nullable<string>;
  url?: Nullable<string>;
}

interface RoleDoc {
  slug: string;
  level: number;
  label: string;
  overview: string;
  nextStep?: Nullable<string>;
  resources?: Nullable<ResourceRow[]>;
}

interface ProgrammeDoc {
  slug: string;
  type: ProgrammeType;
  levels: number[];
  title: string;
  fullTitle?: Nullable<string>;
  description: string;
  suggestionLine?: Nullable<string>;
  whoItsFor: string;
  outcomes: string;
  ctaUrl?: Nullable<string>;
  moreInfoUrl?: Nullable<string>;
  relatedProgrammes?: Nullable<string[]>;
  resources?: Nullable<ResourceRow[]>;
  recommendation?: Nullable<string>;
  faqs?: Nullable<ProgrammeFaq[]>;
  quote?: Nullable<string>;
  quoteAuthor?: Nullable<string>;
  quoteUrl?: Nullable<string>;
}

type PersonaDoc = Omit<Persona, "id"> & { slug: string };
type StoryDoc = Omit<Story, "id"> & { slug: string };
type FaqDoc = Omit<Faq, "id"> & { slug: string; order: number };

async function fetchJson<T>(
  cmsUrl: string,
  path: string,
  locale: string,
): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${cmsUrl}${path}${sep}locale=${locale}`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`CMS request failed: ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const texts = (rows: TextRow[] | undefined): string[] =>
  (rows ?? []).map((r) => r.text);

const opt = (value: Nullable<string>): string | undefined =>
  value?.trim() ? value : undefined;

const toResources = (rows: Nullable<ResourceRow[]>): LearningResource[] =>
  (rows ?? []).map((r) => ({
    title: r.title,
    description: opt(r.description),
    url: opt(r.url),
  }));

const toRole = (doc: RoleDoc): Role => ({
  id: doc.slug,
  level: doc.level,
  label: doc.label,
  overview: doc.overview,
  nextStep: doc.nextStep ?? "",
  resources: toResources(doc.resources),
});

const toProgramme = (doc: ProgrammeDoc): Programme => ({
  id: doc.slug,
  type: doc.type,
  levels: doc.levels,
  title: doc.title,
  fullTitle: opt(doc.fullTitle),
  description: doc.description,
  suggestionLine: doc.suggestionLine ?? "",
  whoItsFor: doc.whoItsFor,
  outcomes: doc.outcomes,
  ctaUrl: opt(doc.ctaUrl),
  moreInfoUrl: opt(doc.moreInfoUrl),
  relatedProgrammeIds: doc.relatedProgrammes ?? [],
  resources: toResources(doc.resources),
  recommendation: opt(doc.recommendation),
  faqs: (doc.faqs ?? []).map(({ question, answer }) => ({ question, answer })),
  quote: opt(doc.quote),
  quoteAuthor: opt(doc.quoteAuthor),
  quoteUrl: opt(doc.quoteUrl),
});

export function getCmsUrl(): string | null {
  const url = import.meta.env.VITE_CMS_URL?.trim();
  return url ? url.replace(/\/$/, "") : null;
}

/**
 * Fetches the full content bundle from the CMS in the given locale (the CMS
 * falls back to English field-by-field for missing translations). Throws when
 * the CMS is unreachable or returns a bad response.
 */
export async function fetchSiteContent(
  cmsUrl: string,
  locale = "en",
): Promise<SiteContent> {
  const [siteCopy, roles, personas, programmes, stories, faqs] =
    await Promise.all([
      fetchJson<SiteCopyGlobal>(cmsUrl, "/api/globals/site-copy", locale),
      fetchJson<PayloadListResponse<RoleDoc>>(
        cmsUrl,
        "/api/roles?sort=level&limit=100",
        locale,
      ),
      fetchJson<PayloadListResponse<PersonaDoc>>(
        cmsUrl,
        "/api/personas?limit=100",
        locale,
      ),
      fetchJson<PayloadListResponse<ProgrammeDoc>>(
        cmsUrl,
        "/api/programmes?limit=100",
        locale,
      ),
      fetchJson<PayloadListResponse<StoryDoc>>(
        cmsUrl,
        "/api/stories?limit=100",
        locale,
      ),
      fetchJson<PayloadListResponse<FaqDoc>>(
        cmsUrl,
        "/api/faqs?sort=order&limit=100",
        locale,
      ),
    ]);

  const intentSelector: IntentSelectorContent = {
    question: siteCopy.intentSelector.question,
    microcopy: siteCopy.intentSelector.microcopy,
    options: siteCopy.intentSelector.options.map((o) => ({
      value: o.value,
      label: o.label,
    })),
  };

  const personaQualifyingQuestions: PersonaQualifyingQuestion[] =
    siteCopy.personaQualifier.questions.map((q) => ({
      id: q.questionId,
      question: q.question,
      options: q.options.map((o) => ({
        label: o.label,
        personaId: o.personaSlug,
      })),
    }));

  return {
    strapline: siteCopy.strapline,
    introBlock: siteCopy.introBlock,
    intentSelector,
    pathAiConfig: {
      sectionTitle: siteCopy.pathAiConfig.sectionTitle,
      inputPlaceholder: siteCopy.pathAiConfig.inputPlaceholder,
      quickPrompts: texts(siteCopy.pathAiConfig.quickPrompts),
    },
    sellingPoints: (siteCopy.sellingPoints ?? []).map(({ title, body }) => ({
      title,
      body,
    })),
    managerGuidance: texts(siteCopy.managerGuidance),
    leaderActionSteps: texts(siteCopy.leaderActionSteps),
    roles: roles.docs.map(toRole),
    personas: personas.docs.map(({ slug, ...p }) => ({ id: slug, ...p })),
    programmes: programmes.docs.map(toProgramme),
    stories: stories.docs.map(({ slug, ...s }) => ({ id: slug, ...s })),
    faqs: faqs.docs.map((f) => ({
      id: f.slug,
      question: f.question,
      answer: f.answer ?? "",
    })),
    personaQualifyingQuestions,
  };
}
