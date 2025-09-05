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
      type: 'string',
      options: {
        list: [
          {title: 'Billing', value: 'content/billing'},
          {title: 'Contract', value: 'content/contract'},
          {title: 'Enquiry', value: 'content/enquiry'},
          {title: 'House', value: 'content/house'},
          {title: 'Info', value: 'content/info'},
          {title: 'Map', value: 'content/map'},
          {title: 'Savings', value: 'content/savings'},
          {title: 'Search', value: 'content/search'},
          {title: 'Security', value: 'content/security'},
          {title: 'Settings', value: 'content/settings'}
        ]
      },
      description: 'Icon to represent this category'
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