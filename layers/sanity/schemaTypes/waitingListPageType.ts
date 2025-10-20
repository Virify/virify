import {defineField, defineType} from 'sanity'

export const waitingListPageType = defineType({
  name: 'waitingListPage',
  title: 'Waiting List Page',
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
          description: 'Main headline (use {gradient} to mark text for gradient styling)',
          initialValue: "The {gradient}UK's{/gradient} first {gradient}open{/gradient} property marketplace",
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            'Market privately, search with AI, and connect directly with sellers and landlords. Save time, cut costs, take control.',
        },
      ],
    }),

    // Form Section
    defineField({
      name: 'formSection',
      title: 'Sign Up Form Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Get early access',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 4,
          initialValue:
            "Whether you're looking for your next home, ready to market privately, or an estate agent looking for a more cost-effective and easy-to-use platform, join our waiting list for exclusive early access and progress updates.",
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Join Waiting List',
        },
      ],
    }),

    // Buyers Benefits Section
    defineField({
      name: 'buyersBenefits',
      title: 'For Buyers Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'For {gradient}smart home seekers{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            "We're building the property search platform we wish existed. AI-powered, data-driven, and brutally honest about what you're actually getting.",
        },
        {
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'Icon Name', type: 'string'},
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'subtitle', title: 'Subtitle', type: 'string'},
                {name: 'description', title: 'Description', type: 'text', rows: 3},
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'subtitle',
                },
              },
            },
          ],
          initialValue: [
            {
              icon: 'ai/prompt',
              title: 'AI-Powered Search',
              subtitle: 'Tell us in plain English',
              description:
                '"Big garden and quiet street" beats ticking 50 boxes. Our AI understands what you actually mean and finds properties that match.',
            },
            {
              icon: 'listings/savings',
              title: 'Real Data, No Spin',
              subtitle: 'Facts in one place',
              description:
                'Actual sale prices, genuine crime stats, honest flood risks. We do the leg work and pull all the data into one place.',
            },
            {
              icon: 'explore/map',
              title: 'Map-Based Searching',
              subtitle: 'Draw your perfect area',
              description:
                'Draw your perfect area on a map. See everything available at once. No more clicking through hundreds of listings one by one.',
            },
            {
              icon: 'amenities/school',
              title: 'Neighbourhood Insights',
              subtitle: "What it's like to live there",
              description:
                'Schools, transport, broadband speeds, energy costs. All the crucial stuff you need to make a decision on your next home.',
            },
            {
              icon: 'listings/eco',
              title: 'Running Costs',
              subtitle: 'Bills before you commit',
              description:
                'From energy ratings, council tax bands and utilities, see how much the bills currently cost, and estimate your outgoings.',
            },
            {
              icon: 'property/security',
              title: 'Deal Direct with Owners',
              subtitle: 'Virified private listings, no middlemen',
              description:
                'Connect directly with real people and get the detail from the people who actually own the place, without the marketing spin.',
            },
          ],
        },
      ],
    }),

    // Sellers Benefits Section
    defineField({
      name: 'sellersBenefits',
      title: 'For Sellers Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Market {gradient}smarter{/gradient}, keep {gradient}more{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            'Create your own listing and connect directly with home seekers. Take control, manage your process and save costs.',
        },
        {
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'icon', title: 'Icon Name', type: 'string'},
                {name: 'title', title: 'Title', type: 'string'},
                {name: 'subtitle', title: 'Subtitle', type: 'string'},
                {name: 'description', title: 'Description', type: 'text', rows: 3},
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'subtitle',
                },
              },
            },
          ],
          initialValue: [
            {
              icon: 'listings/savings',
              title: 'Keep more of your money',
              subtitle: 'No commission, no hidden costs',
              description: 'Clear, up-front and low-costs. Sounds good? Market on Virify.',
            },
            {
              icon: 'cards/verified',
              title: 'Take control',
              subtitle: 'Your listing, your style',
              description:
                'Our personalised dashboard provides you with all the easy-to-use tools you need to market your property at your own pace.',
            },
            {
              icon: 'account/chat',
              title: 'Direct messaging',
              subtitle: 'Messages without the middlemen',
              description:
                'Message users directly through our secure platform. Arrange viewings and discuss offers on your terms.',
            },
            {
              icon: 'ai/edit',
              title: 'Easy Listing Creation',
              subtitle: 'Guided and intuitive creation',
              description: 'Our guided form makes listing simple. Add photos and details in minutes.',
            },
            {
              icon: 'explore/ai',
              title: 'AI-Powered Matching',
              subtitle: 'Be matched to the right person for your home using our AI-powered search.',
              description:
                'Be matched to the right person for your home using our AI-powered search.',
            },
            {
              icon: 'content/info',
              title: 'Support & Guidance',
              subtitle: 'From thinking about marketing to accepting an offer',
              description:
                'First time marketing without an estate agent? Our guides and easy-to-use platform gives you all the tools you need.',
            },
          ],
        },
      ],
    }),

    // Early Access Benefits Section
    defineField({
      name: 'earlyAccessBenefits',
      title: 'Early Access Benefits Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Get {gradient}ahead{/gradient} before everyone else',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 3,
          initialValue:
            "Get first access to a smarter way to buy and sell property, powered by AI, built by real people who've had enough of the old way.",
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
              title: '{gradient}Be First In{/gradient}',
              description:
                'Get early access before launch. Be amongst the first to search with AI or list your property privately in the UK.',
              variant: 'primary',
            },
            {
              title: 'Insider Perks',
              description:
                'Founding members get reduced fees and first access to our AI-powered tools.',
              variant: 'secondary',
            },
            {
              title: '{gradient}Direct Influence{/gradient}',
              description:
                'Your feedback shapes our next features, from smarter search filters to better pricing tools.',
              variant: 'primary',
            },
          ],
        },
      ],
    }),

    // Contact Section
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Have questions? {gradient}Let\'s talk{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: '',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            "We're here to help. Whether you have questions about our platform, want to learn more about how Virify works, or are interested in partnering with us, we'd love to hear from you.",
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Get in touch',
        },
      ],
    }),

    // Final CTA Section
    defineField({
      name: 'finalCta',
      title: 'Final CTA Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Use {gradient}text{/gradient} for gradient styling',
          initialValue: 'Ready to market the {gradient}new way?{/gradient}',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: '',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          initialValue:
            "Join thousands who are ready for honest property searching and direct private listings. Whether you're buying, selling, leasing or renting, Virify puts you in control.",
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Join the Waiting List',
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
          initialValue: 'Join Virify Waiting List - The UK\'s First Open Property Marketplace',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Recommended: 150-160 characters',
          validation: (Rule) => Rule.max(160).warning('Descriptions over 160 characters may be truncated'),
          initialValue:
            'Get early access to Virify, an AI-powered property search with real data, map-based searching, and direct connections to sellers and landlords. Whether you\'re ready to market privately or an estate agent looking for a more cost-effective solution, Virify has you covered.',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'string',
          description: 'Comma-separated keywords for SEO',
          initialValue:
            'property portal, property sales, buy property, rent property, sell property, property marketplace UK, AI property search, sell without estate agent, private property listings, buy direct from owner, map-based property search, UK property platform, estate agent alternative',
        },
        {
          name: 'ogTitle',
          title: 'Open Graph Title',
          type: 'string',
          description: 'Title for social media shares (Facebook, LinkedIn, etc.)',
          initialValue: 'Join Virify Waiting List - The UK\'s First Open Property Marketplace',
        },
        {
          name: 'ogDescription',
          title: 'Open Graph Description',
          type: 'text',
          rows: 2,
          description: 'Description for social media shares',
          initialValue:
            'Market privately, search with AI, and connect directly. Save time, cut costs, take control of your property journey.',
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
          initialValue: 'https://virify.co.uk/waiting-list',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Waiting List Page',
      }
    },
  },
})
