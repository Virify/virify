import {defineField, defineType} from 'sanity'

export const guideCategory = defineType({
  name: 'guideCategory',
  title: 'Guide Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'The name of the guide category (e.g., "Buying", "Selling", "Rentals")'
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of what this category covers'
    }),
    defineField({
      name: 'heroImage',
      title: 'Category Hero Image',
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
      description: 'Main image for the category page'
    }),
    defineField({
      name: 'icon',
      title: 'Category Icon',
      type: 'image',
      options: {
        accept: '.svg,.png,.jpg,.jpeg',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
      description: 'Small icon to represent this category'
    }),
    defineField({
      name: 'orderIndex',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category should appear (lower numbers first)',
      initialValue: 0
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is currently active and visible'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'heroImage',
      order: 'orderIndex'
    },
    prepare(selection) {
      const {title, subtitle, media, order} = selection
      return {
        title: title,
        subtitle: `Order: ${order || 0} - ${subtitle || 'No description'}`,
        media: media
      }
    }
  }
})