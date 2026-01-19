import { defineType, defineField } from "sanity";

export const termsType = defineType({
  name: 'terms',
  title: 'Terms and Conditions',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Terms and Conditions',
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
      initialValue: {current: 'terms'},
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Terms Content',
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
            {title: 'Numbered', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike-through', value: 'strike-through'},
            ],
            annotations: [
              {
                title: 'Link',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (rule) => rule.required().uri({
                      allowRelative: true,
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
                    description: 'External links usually open in a new tab'
                  }
                ]
              },
            ]
          }
        },
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              validation: (rule) => rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption (optional)'
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
              title: 'Table Caption (optional)',
              type: 'string',
              description: 'A brief description of the table content'
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
                      validation: (rule) => rule.required().min(1)
                    },
                    {
                      name: 'isHeader',
                      title: 'Header Row',
                      type: 'boolean',
                      initialValue: false,
                      description: 'Check this for the first row (column headings)'
                    }
                  ],
                  preview: {
                    select: {
                      cells: 'cells',
                      isHeader: 'isHeader'
                    },
                    prepare({cells, isHeader}) {
                      return {
                        title: isHeader ? '📋 Header Row' : 'Row',
                        subtitle: cells?.join(' | ') || 'Empty row'
                      }
                    }
                  }
                }
              ],
              validation: (rule) => rule.required().min(1)
            }
          ],
          preview: {
            select: {
              caption: 'caption',
              rows: 'rows'
            },
            prepare({caption, rows}) {
              return {
                title: '📊 Table',
                subtitle: caption || `${rows?.length || 0} rows`
              }
            }
          }
        },
        {
          name: 'callout',
          title: 'Callout Box',
          type: 'object',
          description: 'Highlighted information boxes for important notices',
          fields: [
            {
              name: 'type',
              title: 'Callout Type',
              type: 'string',
              options: {
                list: [
                  {title: '💡 Info', value: 'info'},
                  {title: '⚠️ Warning', value: 'warning'},
                  {title: '✅ Success', value: 'success'},
                  {title: '🚨 Error', value: 'error'},
                  {title: '💭 Tip', value: 'tip'}
                ],
                layout: 'radio'
              },
              initialValue: 'info',
              validation: (rule) => rule.required()
            },
            {
              name: 'content',
              title: 'Callout Content',
              type: 'array',
              of: [{
                type: 'block',
                styles: [{title: 'Normal', value: 'normal'}],
                lists: [],
                marks: {
                  decorators: [
                    {title: 'Strong', value: 'strong'},
                    {title: 'Emphasis', value: 'em'}
                  ],
                  annotations: [
                    {
                      title: 'Link',
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
              }],
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
              const text = block
                ? block.children
                  ?.filter((child: any) => child._type === 'span')
                  ?.map((span: any) => span.text)
                  ?.join('')
                : 'No content'
              
              const emojiMap: Record<string, string> = {
                info: '💡',
                warning: '⚠️',
                success: '✅',
                error: '🚨',
                tip: '💭'
              }
              const emoji = emojiMap[type || 'info'] || '💡'

              return {
                title: `${emoji} ${type?.toUpperCase() || 'INFO'} Callout`,
                subtitle: text
              }
            }
          }
        },
        {
          name: 'divider',
          title: 'Divider',
          type: 'object',
          description: 'A horizontal rule to separate sections',
          fields: [
            {
              name: 'style',
              title: 'Divider Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Solid', value: 'solid'},
                  {title: 'Dashed', value: 'dashed'},
                  {title: 'Dotted', value: 'dotted'}
                ]
              },
              initialValue: 'solid'
            }
          ],
          preview: {
            prepare() {
              return {
                title: '━━━ Divider ━━━'
              }
            }
          }
        }
      ],
      validation: (rule) => rule.required(),
      description: 'Rich content editor with full WYSIWYG support for legal copy'
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      description: 'When this document was last updated'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      updatedAt: 'updatedAt'
    },
    prepare(selection) {
      const {title, updatedAt} = selection
      return {
        title,
        subtitle: updatedAt ? `Last updated: ${new Date(updatedAt).toLocaleDateString()}` : 'No update date'
      }
    }
  }
})