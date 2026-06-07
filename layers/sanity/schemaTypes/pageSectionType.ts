import {defineType, defineField} from 'sanity'

export const pageSectionType = defineType({
  name: 'pageSection',
  title: 'Page Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Section Headline',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'description',
      title: 'Section Description',
      type: 'text',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Feature Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'description',
              title: 'Feature Description',
              type: 'text',
            }),
            defineField({
              name: 'icon',
              title: 'Feature Icon',
              type: 'string',
              description:
                'Name of the icon from our set of available icons. We use i-lucide icons, see https://lucide.dev/icons for available options.',
            }),
            defineField({
              name: 'iconColor',
              title: 'Feature Icon Color',
              description: 'text-primary, text-secondary, text-info, text-warning or text-error',
              type: 'string',
              options: {
                list: ['text-primary', 'text-secondary', 'text-info', 'text-warning', 'text-error'],
              },
              initialValue: 'text-secondary',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse Layout',
      type: 'boolean',
      description: 'Toggle to reverse the layout of this section on desktop',
      initialValue: false,
    }),
    defineField({
      name: 'orientation',
      title: 'Feature Orientation',
      type: 'string',
      description:
        'Choose whether features should be displayed in a row (horizontal) or column (vertical)',
      options: {
        list: ['horizontal', 'vertical'],
      },
      initialValue: 'vertical',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      description:
        'Optional image to display alongside this section. Recommended dimensions 540x540px.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title,
        subtitle,
      }
    },
  },
})
