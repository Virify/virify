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
      name: "buttons",
      title: "CTA Buttons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Button Text",
              type: "string",
              validation: (Rule) => Rule.required().max(50),
            }),
            defineField({
              name: "url",
              title: "Button URL",
              type: "string",
              initialValue: "#",
            }),
            defineField({
              name: "signup",
              title: "Is this a sign-up button? Should it open the modal",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "login",
              title: "Is this a login button? Should it open the modal",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "icon",
              title: "Button Icon",
              type: "string",
              description:
                "Name of the icon from our set of available icons. We use i-lucide icons, see https://lucide.dev/icons for available options.",
                validation: (Rule) => Rule.max(50),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      description:
        'Optional image to display alongside this section. Recommended dimensions 540x540px.',
      options: {
        hotspot: true,
      },
      fields: [
        // Nested metadata fields attached directly to this specific image
        defineField({
          name: 'alt',
          title: 'Alternative Text (Alt text)',
          type: 'string',
          description:
            'Crucial for accessibility and SEO. Describe what is in the image for screen readers.',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              // If there is an image uploaded, make the alt text strictly required
              const parent = context.parent as any
              if (parent?.asset && !value) {
                return 'Alternative text is required when an image is uploaded.'
              }
              return true
            }),
        }),
      ],
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
