import { defineType, defineField } from "sanity";

export const pageCtaType = defineType({
  name: "pageCta",
  title: "Page CTA Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "CTA Section Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "description",
      title: "CTA Section Description",
      type: "text",
      validation: (Rule) => Rule.max(1000),
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
              type: "url",
              initialValue: "https://virify.co.uk",
            }),
            defineField({
              name: "signup",
              title: "Is this a sign-up button? Should it open the modal",
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
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});