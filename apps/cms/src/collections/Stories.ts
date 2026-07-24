import type { CollectionConfig } from 'payload'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'name',
    description: 'Colleague success stories pinned to the map.',
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
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'pathDescription',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'e.g. "Housekeeping → Supervisor → Manager"' },
    },
    { name: 'shortStory', type: 'textarea', required: true, localized: true },
  ],
}
