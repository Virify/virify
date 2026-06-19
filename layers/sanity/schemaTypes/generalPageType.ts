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
    defineField({
      name: 'category',
      title: 'Page Category',
      type: 'reference',
      to: [{type: 'pageCategory'}],
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
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
          // Giving the object a preview makes reordering much easier in the array list
          preview: {
            select: {
              title: 'label',
              signup: 'signup',
              login: 'login',
              url: 'url',
            },
            prepare({title, signup, login, url}) {
              let subtitle = url || ''
              if (signup) subtitle = '⚡ Action: Open Signup Modal'
              if (login) subtitle = '🔒 Action: Open Login Modal'
              return {title: title || 'Untitled Button', subtitle}
            },
          },
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
              description: 'Lucide icon name (e.g., arrow-right, activity).',
              validation: (Rule) => Rule.max(50),
            }),
            defineField({
              name: 'signup',
              title: 'Sign-up Button',
              description: 'Opens the sign-up modal window',
              type: 'boolean',
              initialValue: false,
              // Disable if login is active to prevent conflicting configurations
              readOnly: ({parent}) => parent?.login === true,
            }),
            defineField({
              name: 'login',
              title: 'Login Button',
              description: 'Opens the login modal window',
              type: 'boolean',
              initialValue: false,
              // Disable if signup is active to prevent conflicting configurations
              readOnly: ({parent}) => parent?.signup === true,
            }),
            defineField({
              name: 'url',
              title: 'Button URL',
              type: 'url',
              // Visually hides the URL box if a modal action is already selected
              hidden: ({parent}) => parent?.signup === true || parent?.login === true,
              validation: (Rule) =>
                Rule.uri({allowRelative: true}).custom((value, context) => {
                  const {signup, login} = (context.parent as any) || {}

                  // 1. If it's a modal action, the URL field must be empty
                  if (signup === true || login === true) {
                    return value ? 'Remove the URL path if this opens a modal.' : true
                  }

                  // 2. If no modal is selected, a redirect URL string is required
                  if (!value) {
                    return 'You must provide a URL link, or toggle a modal action above.'
                  }

                  return true
                }),
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
      of: [{type: 'pageSection'}, {type: 'pageFaq'}, {type: 'pageGuidesGrid'}],
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
      name: 'seoKeywords',
      title: 'Keywords',
      description:
        'Comma-separated keywords targeting specific search queries (e.g. property platform, private listings).',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title',
      description:
        'Custom title for social media shares (LinkedIn, Slack, Facebook). Falls back to SEO Title if empty.',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      description:
        'Custom description for social media shares. Falls back to Meta Description if empty.',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'twitterCard',
      title: 'Twitter / X Card Type',
      description: 'Controls layout presentation on X. Default is a large summary image preview.',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          {title: 'Large Preview Image', value: 'summary_large_image'},
          {title: 'Standard Small Square', value: 'summary'},
        ],
        layout: 'radio',
      },
      initialValue: 'summary_large_image',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      description:
        'Explicitly state primary resource location to avoid duplicate content flags. Usually safe to leave blank.',
      type: 'url',
      group: 'seo',
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
