import type { CollectionConfig } from 'payload'

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type'],
    description:
      'Learning programmes on the map: core learning (Journey to...) and accredited diplomas.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Stable id used by the map topology (e.g. "journey_supervisor"). Do not change once live.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Core journey', value: 'core' },
        { label: 'Accredited diploma', value: 'advanced' },
      ],
    },
    {
      name: 'levels',
      type: 'number',
      hasMany: true,
      required: true,
      admin: {
        description: 'Role levels this programme spans on the map (0–4).',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Short title used on the map and in buttons.' },
    },
    {
      name: 'fullTitle',
      type: 'text',
      localized: true,
      admin: { description: 'Panel heading if different, e.g. with "(Level 3)".' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Short description: panel intro and map tooltip.' },
    },
    {
      name: 'suggestionLine',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Shown after the title in a role\'s "Suggested programmes" list, e.g. "core pathway towards your next role."',
      },
    },
    { name: 'whoItsFor', type: 'textarea', required: true, localized: true },
    {
      name: 'outcomes',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: '"What you\'ll gain".' },
    },
    {
      name: 'ctaUrl',
      type: 'text',
      localized: true,
      admin: { description: 'Start now (core) / Enrol now (diploma) link.' },
    },
    {
      name: 'moreInfoUrl',
      type: 'text',
      localized: true,
      admin: { description: 'Learn more (core) / Find out more (diploma) link.' },
    },
    {
      name: 'relatedProgrammes',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Related learning: programme slugs in display order (e.g. "journey_manager").',
      },
    },
    {
      name: 'resources',
      type: 'array',
      localized: true,
      admin: {
        description:
          'Learning links that are not on the map (e.g. Colleague Learning Guide). Shown under Related learning.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'recommendation',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (data) => data?.type === 'advanced',
        description: '"Is this right for me?" guidance.',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      localized: true,
      admin: {
        condition: (data) => data?.type === 'advanced',
        description: 'Questions shown under "Talk to your manager".',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      localized: true,
      admin: { condition: (data) => data?.type === 'advanced' },
    },
    {
      name: 'quoteAuthor',
      type: 'text',
      localized: true,
      admin: { condition: (data) => data?.type === 'advanced' },
    },
    {
      name: 'quoteUrl',
      type: 'text',
      localized: true,
      admin: {
        condition: (data) => data?.type === 'advanced',
        description: '"Read more" link under the testimonial.',
      },
    },
  ],
}
