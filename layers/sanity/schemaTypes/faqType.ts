import { defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ Item",
  type: "document",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().max(200),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required().max(2000),
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Set to true to open this FAQ item by default",
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});