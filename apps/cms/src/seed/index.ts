/**
 * Seeds the CMS with the placeholder campaign content from the frontend's
 * static content model (seed-data.json is generated from apps/web).
 *
 * Run with: pnpm seed
 * Idempotent: collections are only seeded when empty; the site-copy global
 * is always overwritten with the seed values.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import seedData from './seed-data.json'

async function run() {
  const payload = await getPayload({ config })

  const collectionSeeds = [
    {
      slug: 'roles' as const,
      docs: seedData.roles.map((r) => ({
        slug: r.id,
        level: r.level,
        label: r.label,
        overview: r.overview,
        quote: r.quote,
        quoteAuthor: r.quoteAuthor,
      })),
    },
    {
      slug: 'personas' as const,
      docs: seedData.personas.map((p) => ({
        slug: p.id,
        label: p.label,
        description: p.description,
        panelFocusSelf: p.panelFocusSelf,
        panelFocusLeader: p.panelFocusLeader,
      })),
    },
    {
      slug: 'programmes' as const,
      docs: seedData.programmes.map((p) => ({
        slug: p.id,
        type: p.type,
        levels: p.levels,
        title: p.title,
        mapSummary: p.mapSummary,
        leadsTo: p.leadsTo,
        whoItsFor: p.whoItsFor,
        skillsDeveloped: p.skillsDeveloped,
        whatToExpect: p.whatToExpect,
        timeCommitment: p.timeCommitment,
        nextStep: p.nextStep,
        whyChooseThis: p.whyChooseThis,
        quote: p.quote,
        quoteAuthor: p.quoteAuthor,
      })),
    },
    {
      slug: 'stories' as const,
      docs: seedData.stories.map((s) => ({
        slug: s.id,
        name: s.name,
        pathDescription: s.pathDescription,
        shortStory: s.shortStory,
      })),
    },
    {
      slug: 'faqs' as const,
      docs: seedData.faqs.map((f, i) => ({
        slug: f.id,
        question: f.question,
        answer: f.answer,
        order: i,
      })),
    },
  ]

  for (const { slug, docs } of collectionSeeds) {
    const existing = await payload.count({ collection: slug })
    if (existing.totalDocs > 0) {
      payload.logger.info(`Skipping ${slug}: already has ${existing.totalDocs} docs`)
      continue
    }
    for (const data of docs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: slug, data: data as any })
    }
    payload.logger.info(`Seeded ${docs.length} ${slug}`)
  }

  await payload.updateGlobal({
    slug: 'site-copy',
    data: {
      strapline: seedData.strapline,
      introBlock: seedData.introBlock,
      intentSelector: {
        question: seedData.intentSelector.question,
        microcopy: seedData.intentSelector.microcopy,
        options: seedData.intentSelector.options.map((o) => ({
          value: o.value as 'selfGrowth' | 'developingTeam' | 'learnAbout',
          label: o.label,
        })),
      },
      pathAiConfig: {
        sectionTitle: seedData.pathAiConfig.sectionTitle,
        inputPlaceholder: seedData.pathAiConfig.inputPlaceholder,
        quickPrompts: seedData.pathAiConfig.quickPrompts.map((text) => ({ text })),
      },
      sellingPoints: seedData.sellingPoints.map((text) => ({ text })),
      managerGuidance: seedData.managerGuidance.map((text) => ({ text })),
      leaderActionSteps: seedData.leaderActionSteps.map((text) => ({ text })),
      personaQualifier: {
        questions: seedData.personaQualifyingQuestions.map((q) => ({
          questionId: q.id,
          question: q.question,
          options: q.options.map((o) => ({
            label: o.label,
            personaSlug: o.personaId,
          })),
        })),
      },
    },
  })
  payload.logger.info('Seeded site-copy global')

  payload.logger.info('Seed complete')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
