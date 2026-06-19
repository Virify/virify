import {defineField, defineType} from 'sanity'

export const cookieType = defineType({
  name: 'cookie',
  title: 'Cookie Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Cookie Policy',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      initialValue: {current: 'cookie'},
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Cookie Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) =>
                      rule.required().uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    description: 'Read https://css-tricks.com/use-target_blank/',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
        {
          name: 'table',
          title: 'Table',
          type: 'object',
          fields: [
            {
              name: 'caption',
              title: 'Table Caption (optional)',
              type: 'string',
              description: 'A brief description of the table content',
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
                      of: [{type: 'string'}],
                      validation: (rule) => rule.required().min(1),
                    },
                    {
                      name: 'isHeader',
                      title: 'Header Row',
                      type: 'boolean',
                      initialValue: false,
                      description: 'Check this for the first row (column headings)',
                    },
                  ],
                  preview: {
                    select: {
                      cells: 'cells',
                      isHeader: 'isHeader',
                    },
                    prepare({cells, isHeader}) {
                      return {
                        title: isHeader ? '📋 Header Row' : 'Row',
                        subtitle: cells?.join(' | ') || 'Empty row',
                      }
                    },
                  },
                },
              ],
              validation: (rule) => rule.required().min(1),
            },
          ],
          preview: {
            select: {
              caption: 'caption',
              rows: 'rows',
            },
            prepare({caption, rows}) {
              return {
                title: '📊 Table',
                subtitle: caption || `${rows?.length || 0} rows`,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      updatedAt: 'updatedAt',
    },
    prepare({title, updatedAt}) {
      const date = new Date(updatedAt)
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      return {
        title: title,
        subtitle: `Last updated: ${formattedDate}`,
      }
    },
  },
})
