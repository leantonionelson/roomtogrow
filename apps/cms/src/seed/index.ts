/**
 * Seeds the CMS with the campaign content from the frontend's static content
 * model (seed-data.json is generated from apps/web/src/data/contentModel.ts).
 *
 * Run with: pnpm seed            — collections are only seeded when empty
 *           pnpm seed --update   — upsert every seed doc by slug (overwrites
 *                                  CMS edits to those docs; extra docs are
 *                                  reported, never deleted)
 * The site-copy global is always overwritten with the seed values.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import seedData from './seed-data.json'

const UPDATE = process.argv.includes('--update')

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
        nextStep: r.nextStep,
        resources: r.resources,
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
        fullTitle: 'fullTitle' in p ? p.fullTitle : undefined,
        description: p.description,
        suggestionLine: p.suggestionLine,
        whoItsFor: p.whoItsFor,
        outcomes: p.outcomes,
        relatedProgrammes: p.relatedProgrammeIds,
        resources: p.resources,
        recommendation: 'recommendation' in p ? p.recommendation : undefined,
        faqs: p.faqs,
        quote: 'quote' in p ? p.quote : undefined,
        quoteAuthor: 'quoteAuthor' in p ? p.quoteAuthor : undefined,
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
    if (existing.totalDocs > 0 && !UPDATE) {
      payload.logger.info(`Skipping ${slug}: already has ${existing.totalDocs} docs`)
      continue
    }
    for (const data of docs) {
      const found = await payload.find({
        collection: slug,
        where: { slug: { equals: data.slug } },
        limit: 1,
      })
      const doc = found.docs[0]
      if (doc) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.update({ collection: slug, id: doc.id, data: data as any })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.create({ collection: slug, data: data as any })
      }
    }
    payload.logger.info(`Seeded ${docs.length} ${slug}`)

    const seedSlugs = new Set(docs.map((d) => d.slug))
    const all = await payload.find({ collection: slug, limit: 1000, pagination: false })
    const extra = all.docs.map((d) => d.slug).filter((s) => !seedSlugs.has(s))
    if (extra.length) {
      payload.logger.warn(`${slug}: not in seed data (left in place): ${extra.join(', ')}`)
    }
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
      sellingPoints: seedData.sellingPoints,
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
