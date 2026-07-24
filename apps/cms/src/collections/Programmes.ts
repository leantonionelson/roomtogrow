import type { CollectionConfig } from 'payload'

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type'],
    description:
      'Learning programmes on the map: core journeys and advanced (diploma) programmes.',
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
        { label: 'Advanced / diploma', value: 'advanced' },
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
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'mapSummary',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'One-line summary for map tooltips and sidebar.' },
    },
    { name: 'leadsTo', type: 'textarea', required: true, localized: true },
    { name: 'whoItsFor', type: 'textarea', required: true, localized: true },
    { name: 'skillsDeveloped', type: 'textarea', required: true, localized: true },
    { name: 'whatToExpect', type: 'textarea', required: true, localized: true },
    { name: 'timeCommitment', type: 'text', required: true, localized: true },
    { name: 'nextStep', type: 'textarea', required: true, localized: true },
    {
      name: 'whyChooseThis',
      type: 'textarea',
      localized: true,
      admin: {
        condition: (data) => data?.type === 'advanced',
        description: 'Advanced programmes only.',
      },
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
  ],
}
