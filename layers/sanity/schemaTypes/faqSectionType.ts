import {defineType, defineField} from "sanity";

export const pageFaq = defineType({
  name: "pageFaq",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "highlight",
      title: "Highlight",
      type: "string",
      description: "Optional text to highlight above the title",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{type: "reference", to: {type: "faq"}}],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
  ],
  preview: {
    select: {
      title: "title",
      faqs: "faqs", 
    },
    prepare({ title, faqs }) {
      const faqCount = faqs ? faqs.length : 0;
      
      return {
        title: title || "Untitled FAQ Section",
        subtitle: `${faqCount} FAQ${faqCount !== 1 ? "s" : ""}`,
      };
    },
  },
})