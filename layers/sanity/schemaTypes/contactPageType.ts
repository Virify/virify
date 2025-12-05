import {defineField, defineType} from 'sanity'

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Contact {gradient}us{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            "Whether you're interested in partnering with us, have a question about our platform, or just want to get in touch—we'd love to hear from you.",
        },
      ],
    }),

    // Form Section
    defineField({
      name: 'formSection',
      title: 'Contact Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Talk with our team',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue:
            "Share your questions, ideas, or feedback in the form below. Our team usually replies within 24 hours, so you’ll never be left waiting.",
        },
      ],
    }),

    // Interested Section
    defineField({
      name: 'interestedSection',
      title: "Interested in What We're Doing Section",
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Collaborate with us',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Passionate about reimagining property? So are we. Use the form below to connect and explore how we can work together.',
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Join the waiting list',
        },
      ],
    }),

    // Form Section
    defineField({
      name: 'pressFormSection',
      title: 'Press Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Have a press enquiry?',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue:
            "Journalists, researchers, storytellers: if you’ve got a question, we’ll have an answer. Complete the form below and we’ll get back to you within 24 hours. ",
        },
      ],
    }),

    // Partner Section
    defineField({
      name: 'partnerSection',
      title: 'Partnership Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Looking to {gradient}partner?{/gradient}',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            "We're always open to working with like-minded businesses, property professionals, and technology partners who share our vision of making property buying and selling more transparent and accessible.",
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Get in touch',
        },
      ],
    }),

    // faq section
    defineField({
      name: 'faqSection',
      title: 'FAQ Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Frequently Asked Questions',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Have questions? Here are some of the most common inquiries we receive about our platform and services.',
        },
        {
          name: 'faqs',
          title: 'FAQ Items',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'faq'}]}],
        },
      ],
    }),

    // SEO Metadata
    defineField({
      name: 'seo',
      title: 'SEO & Meta Data',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Recommended: 50-60 characters',
          validation: (Rule) => Rule.max(60).warning('Titles over 60 characters may be truncated'),
          initialValue: "Contact Virify - Get in Touch | The UK's Open Property Marketplace",
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Recommended: 150-160 characters',
          validation: (Rule) =>
            Rule.max(160).warning('Descriptions over 160 characters may be truncated'),
          initialValue:
            "Contact Virify for partnership opportunities, platform enquiries, or questions about the UK's first open property marketplace. We typically respond within 24 hours.",
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'string',
          description: 'Comma-separated keywords for SEO',
          initialValue:
            'contact Virify, property marketplace contact, partnership opportunities, property platform enquiries, estate agent alternative, open property marketplace UK',
        },
        {
          name: 'ogTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media shares (Facebook, LinkedIn, etc.)',
          initialValue: 'Contact Virify - Get in Touch',
        },
        {
          name: 'ogDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
          description: 'Description for social media shares',
          initialValue:
            "Contact us about partnerships, platform questions, or general enquiries about Virify's open property marketplace.",
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'url',
          description: 'Image URL for social media shares (recommended: 1200x630px)',
          initialValue: 'https://virify.co.uk/og-image.jpg',
        },
        {
          name: 'twitterCard',
          title: 'Twitter Card Type',
          type: 'string',
          options: {
            list: [
              {title: 'Summary', value: 'summary'},
              {title: 'Summary Large Image', value: 'summary_large_image'},
            ],
          },
          initialValue: 'summary',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'The canonical URL for this page',
          initialValue: 'https://virify.co.uk/contact',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
      }
    },
  },
})
