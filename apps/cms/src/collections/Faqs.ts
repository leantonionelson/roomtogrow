import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    { name: 'question', type: 'text', required: true, localized: true },
    {
      name: 'answer',
      type: 'textarea',
      localized: true,
      admin: { description: 'FAQs without an answer are hidden on the page.' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Display order, lowest first.' },
    },
  ],
}
