import {defineField, defineType} from 'sanity'

export const guide = defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Guide Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'The main title of the guide'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      description: 'URL-friendly version of the title'
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
      description: 'Brief summary of the guide (max 200 characters)'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (rule) => rule.required(),
        }
      ],
      validation: (rule) => rule.required(),
      description: 'Main hero image for the guide'
    }),
    defineField({
      name: 'category',
      title: 'Guide Category',
      type: 'reference',
      to: [{type: 'guideCategory'}],
      validation: (rule) => rule.required(),
      description: 'The category this guide belongs to'
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Estimated reading time in minutes'
    }),
    defineField({
      name: 'content',
      title: 'Guide Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: (rule) => rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        {
          name: 'table',
          title: 'Table',
          type: 'object',
          fields: [
            {
              name: 'caption',
              title: 'Table Caption',
              type: 'string'
            },
            {
              name: 'rows',
              title: 'Table Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tableRow',
                  title: 'Table Row',
                  fields: [
                    {
                      name: 'cells',
                      title: 'Cells',
                      type: 'array',
                      of: [{type: 'string'}]
                    },
                    {
                      name: 'isHeader',
                      title: 'Header Row',
                      type: 'boolean',
                      initialValue: false
                    }
                  ],
                  preview: {
                    select: {
                      cells: 'cells',
                      isHeader: 'isHeader'
                    },
                    prepare({cells, isHeader}) {
                      return {
                        title: isHeader ? 'Header Row' : 'Data Row',
                        subtitle: cells?.join(' | ') || 'Empty row'
                      }
                    }
                  }
                }
              ]
            }
          ],
          preview: {
            select: {
              caption: 'caption',
              rows: 'rows'
            },
            prepare({caption, rows}) {
              return {
                title: 'Table',
                subtitle: caption || `${rows?.length || 0} rows`
              }
            }
          }
        },
        {
          name: 'callout',
          title: 'Callout Box',
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Callout Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Info', value: 'info'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Success', value: 'success'},
                  {title: 'Error', value: 'error'},
                  {title: 'Tip', value: 'tip'}
                ]
              },
              initialValue: 'info'
            },
            {
              name: 'content',
              title: 'Callout Content',
              type: 'array',
              of: [{type: 'block'}],
              validation: (rule) => rule.required()
            }
          ],
          preview: {
            select: {
              type: 'type',
              content: 'content'
            },
            prepare({type, content}) {
              const block = (content || []).find((block: any) => block._type === 'block')
              return {
                title: `${type?.toUpperCase()} Callout`,
                subtitle: block
                  ? block.children
                    ?.filter((child: any) => child._type === 'span')
                    ?.map((span: any) => span.text)
                    ?.join('')
                  : 'No content'
              }
            }
          }
        }
      ],
      validation: (rule) => rule.required(),
      description: 'The main content of the guide with rich formatting support'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Tags to help categorize and filter guides'
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (rule) => rule.max(60),
          description: 'SEO title (max 60 characters)'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.max(160),
          description: 'SEO description (max 160 characters)'
        }
      ],
      options: {
        collapsible: true,
        collapsed: true
      }
    }),
    defineField({
      name: 'orderIndex',
      title: 'Display Order',
      type: 'number',
      description: 'Order within category (lower numbers first)',
      initialValue: 0
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: 'When this guide was published'
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When this guide was last updated'
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this guide is published and visible'
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Guide',
      type: 'boolean',
      initialValue: false,
      description: 'Feature this guide prominently'
    })
  ],
  orderings: [
    {
      title: 'Order Index',
      name: 'orderIndex',
      by: [{field: 'orderIndex', direction: 'asc'}]
    },
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}]
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'heroImage',
      published: 'isPublished',
      featured: 'isFeatured'
    },
    prepare(selection) {
      const {title, category, media, published, featured} = selection
      const status = published ? '' : '�'
      const featuredIcon = featured ? 'P' : ''
      
      return {
        title: `${status} ${featuredIcon} ${title}`,
        subtitle: category || 'No category assigned',
        media: media
      }
    }
  }
})