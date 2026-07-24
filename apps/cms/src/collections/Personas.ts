import type { CollectionConfig } from 'payload'

export const Personas: CollectionConfig = {
  slug: 'personas',
  admin: {
    useAsTitle: 'label',
    description: 'Audience personas used to tailor the navigator panel copy.',
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
        description: 'Stable id (e.g. "pathfinders"). Do not change once live.',
      },
    },
    { name: 'label', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'panelFocusSelf', type: 'textarea', required: true, localized: true },
    { name: 'panelFocusLeader', type: 'textarea', required: true, localized: true },
  ],
}
