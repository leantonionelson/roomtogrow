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
  Persona,
  PersonaQualifyingQuestion,
  Programme,
  Role,
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
  sellingPoints: TextRow[];
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

type RoleDoc = Omit<Role, "id"> & { slug: string };
type PersonaDoc = Omit<Persona, "id"> & { slug: string };
type ProgrammeDoc = Omit<Programme, "id"> & { slug: string };
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
    sellingPoints: texts(siteCopy.sellingPoints),
    managerGuidance: texts(siteCopy.managerGuidance),
    leaderActionSteps: texts(siteCopy.leaderActionSteps),
    roles: roles.docs.map(({ slug, ...r }) => ({ id: slug, ...r })),
    personas: personas.docs.map(({ slug, ...p }) => ({ id: slug, ...p })),
    programmes: programmes.docs.map(({ slug, ...p }) => ({ id: slug, ...p })),
    stories: stories.docs.map(({ slug, ...s }) => ({ id: slug, ...s })),
    faqs: faqs.docs.map((f) => ({
      id: f.slug,
      question: f.question,
      answer: f.answer,
    })),
    personaQualifyingQuestions,
  };
}
