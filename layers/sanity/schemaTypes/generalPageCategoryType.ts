// schemas/pageCategoryType.ts
import {defineType, defineField} from 'sanity'

export const pageCategoryType = defineType({
  name: 'pageCategory',
  title: 'Page Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Category Slug',
      type: 'slug',
      description: 'Used for the URL path (e.g., "accountment", "information")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
