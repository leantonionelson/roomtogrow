import type { GlobalConfig } from 'payload'

/**
 * All page-level campaign copy: hero strapline, intro, intent selector,
 * selling points, manager guidance, and path-AI panel copy.
 */
export const SiteCopy: GlobalConfig = {
  slug: 'site-copy',
  admin: {
    description: 'Campaign copy for the Room to Grow page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'strapline',
      type: 'group',
      localized: true,
      fields: [
        { name: 'headline', type: 'text', required: true },
        { name: 'intro', type: 'textarea', required: true },
      ],
    },
    {
      name: 'introBlock',
      type: 'group',
      localized: true,
      fields: [
        { name: 'internalComms', type: 'textarea', required: true },
        { name: 'ihgUniversityExplanation', type: 'textarea', required: true },
        { name: 'journeyStartsHere', type: 'textarea' },
      ],
    },
    {
      name: 'intentSelector',
      type: 'group',
      fields: [
        { name: 'question', type: 'text', required: true, localized: true },
        { name: 'microcopy', type: 'textarea', required: true, localized: true },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'select',
              required: true,
              options: ['selfGrowth', 'developingTeam', 'learnAbout'],
            },
            { name: 'label', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: 'pathAiConfig',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text', required: true, localized: true },
        { name: 'inputPlaceholder', type: 'text', required: true, localized: true },
        {
          name: 'quickPrompts',
          type: 'array',
          localized: true,
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    {
      name: 'sellingPoints',
      type: 'array',
      localized: true,
      admin: { description: '"Why invest your time with IHG University?" carousel cards.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'managerGuidance',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'leaderActionSteps',
      type: 'array',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'personaQualifier',
      type: 'group',
      admin: {
        description:
          'Questions that map answers to personas without using internal labels.',
      },
      fields: [
        {
          name: 'questions',
          type: 'array',
          fields: [
            { name: 'questionId', type: 'text', required: true },
            { name: 'question', type: 'text', required: true, localized: true },
            {
              name: 'options',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                {
                  name: 'personaSlug',
                  type: 'text',
                  required: true,
                  admin: { description: 'Must match a persona slug.' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
