import {defineType, defineField} from 'sanity'

export const generalPageType = defineType({
  name: 'generalPage',
  title: 'General Page',
  type: 'document',
  // 1. Define groups to separate Page Content from SEO settings in the CMS
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO / Meta'},
  ],
  fields: [
    /* ================= CONTENT GROUP ================= */
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title', // Auto-generates the slug from your title field
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Page Caption',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'description',
      title: 'Page Description',
      type: 'text',
      group: 'content',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'heroButtons',
      title: 'Hero Buttons',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Button Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'icon',
              title: 'Button Icon',
              type: 'string',
              description:
                'Name of the icon from our set of available icons. We use i-lucide icons, see https://lucide.dev/icons for available options.',
                validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: 'url',
              title: 'Button URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'signup',
              title: 'Is this a sign-up button? Should it open the modal',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'login',
              title: 'Is this a login button?',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      of: [
        {type: 'pageSection'},
        {type: 'pageCta'},
        {type: 'reference', to: [{ type: 'faq' }], title: 'FAQ Item' },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    /* ================= SEO GROUP ================= */
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      description: 'Overwrites the page title in search engines. Ideally between 50-60 characters.',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      description: 'The snippet shown in search results. Ideally between 120-160 characters.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Search Engines (noindex)',
      description: 'Turn this on to tell bots (Google, Bing) not to index this page.',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title || 'Untitled General Page',
      }
    },
  },
})
