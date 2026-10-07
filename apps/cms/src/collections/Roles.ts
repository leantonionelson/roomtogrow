import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'level'],
    description: 'Hotel roles shown on the Growth Navigator map, ordered by level.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'level',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stable id used by the map topology (e.g. "frontline"). Do not change once live.',
      },
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      admin: {
        description: '0 = frontline … 4 = general manager. Drives pyramid tiers.',
      },
    },
    { name: 'label', type: 'text', required: true, localized: true },
    {
      name: 'overview',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: '"Your current role" description in the sidebar.' },
    },
    {
      name: 'nextStep',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: '"Your next step" copy.' },
    },
    {
      name: 'resources',
      type: 'array',
      localized: true,
      admin: {
        description:
          'Learning links that are not on the map (e.g. Colleague Learning Guide). With a description they are also listed under Suggested programmes.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
