import { defineField, defineType } from 'sanity'

export const supportPageType = defineType({
  name: 'supportPage',
  title: 'Support Page',
  type: 'document',
  fields:[
    // hero section
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
          initialValue: '{gradient}Help{/gradient} and {gradient}Support{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            'Find answers to common questions and get assistance from our support team.',
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
          initialValue: 'Frequently Asked {gradient}Questions{/gradient}',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Here are some of our most frequently asked questions. If you need further assistance, feel free to reach out to our support team.',
        },
        {
          name: 'faqs',
          title: 'FAQ Items',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'faq'}]}],
        },
      ],
    }),

    // Our support cards
    defineField({
      name: 'ourSupportSection',
      title: 'Our Support Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Our {gradient}Support{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            '',
        },
        {
          name: 'benefits',
          title: 'Benefits Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  description: 'Use {gradient}text{/gradient} for gradient styling',
                },
                {name: 'description', title: 'Description', type: 'text', rows: 2},
                {
                  name: 'variant',
                  title: 'Card Variant',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                    ],
                  },
                  initialValue: 'primary',
                },
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'variant',
                },
              },
            },
          ],
          initialValue: [
            {
              title: '24/7 Support',
              description:
                'Our support team is available around the clock to assist you with any issues or questions you may have.',
              variant: 'primary',
            },
            {
              title: 'Expert Assistance',
              description:
                'Our support staff are knowledgeable and experienced, ensuring you receive the best possible assistance.',
              variant: 'secondary',
            },
            {
              title: 'Comprehensive Resources',
              description:
                'We provide a wide range of resources, including FAQs, guides, and tutorials to help you find answers quickly.',
              variant: 'primary',
            },
          ],
        },
      ],
    }),

    // what we don't support section
    defineField({
      name: 'whatWeDontSupportSection',
      title: 'Don\'t Support Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Things We {gradient}Can\'t Help With{/gradient}',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'Here are some of our most frequently asked questions. If you need further assistance, feel free to reach out to our support team.',
        },
        {
          name: 'faqs',
          title: 'FAQ Items',
          type: 'array',
          of: [{type: 'reference', to: [{type: 'faq'}]}],
        },
      ],
    }),

    // support form section
    defineField({
      name: 'SupportFormSection',
      title: 'Support Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Contact {gradient}Support{/gradient}',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            'If you have any questions or need assistance, please fill out the form below to contact our support team. We\'re here to help!',
        },
      ],
    }),

    // CTA Section
    defineField({
      name: 'ctaSection',
      title: 'CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Join the {gradient}waiting list{/gradient}',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            "Be the first to know when we launch. Join our waiting list today!",
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Join the waiting list',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/',
        }
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
          validation: (Rule) => Rule.max(120).warning('Titles over 60 characters may be truncated'),
          initialValue: "Support & Help Center | Virify - Property Search Made Easy",
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
            "Get help with Virify's property search platform. Access our comprehensive FAQs, guides, and support resources. Contact our support team for assistance with price paid data, waiting list, and more.",
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'string',
          description: 'Comma-separated keywords for SEO',
          initialValue:
            'property support, help center, FAQ, property guides, UK property data, real estate support',
        },
        {
          name: 'ogTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media shares (Facebook, LinkedIn, etc.)',
          initialValue: 'Support & Help Center | Virify',
        },
        {
          name: 'ogDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
          description: 'Description for social media shares',
          initialValue:
            "Find answers to your questions and get support from the Virify team. Access guides, FAQs, and contact support.",
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
          initialValue: 'summary_large_image',
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'The canonical URL for this page',
          initialValue: 'https://virify.co.uk/support',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Support Page',
      }
    },
  },
})