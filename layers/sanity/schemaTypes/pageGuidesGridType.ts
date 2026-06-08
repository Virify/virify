import { defineType, defineField } from 'sanity'

export const pageGuidesGridType = defineType({
  name: 'pageGuidesGrid',
  title: 'Guides Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the guides grid section.',
      initialValue: 'Continue your property journey',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      initialValue: 'Our guides tackle those “grey areas” of buying and selling...',
    }),
    defineField({
      name: 'guides',
      title: 'Guides',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'guide' }] }],
      description: 'Select guides to feature.',
      validation: (rule) => rule.required().min(3).max(10),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      guides: 'guides',
    },
    prepare({ title, description, guides }) {
      const guideCount = guides ? guides.length : 0
      return {
        title: title || 'Untitled Guides Grid Section',
        subtitle: `${description ? description.substring(0, 50) + '...' : 'No description'} | ${guideCount} guide${guideCount !== 1 ? 's' : ''}`,
      }
    },
  },
})