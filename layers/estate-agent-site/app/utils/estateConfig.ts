export const estateConfig = {
  name: 'Demo Estate Agent',
  tagline: 'Helping you find your next home in London',
  phone: '020 1234 5678',
  email: 'hello@demoestateagent.co.uk',
  hero: {
    title: 'Find your next home in London',
    subtitle:
      'A clean, modern starter site for independent agents, ready to plug into Virify when you are.',
    primaryCta: 'Browse featured properties',
    secondaryCta: 'Book a valuation',
  },
  about: {
    title: 'About Demo Estate Agent',
    subtitle: 'Your trusted local property experts',
    paragraphs: [
      'This demo shows how Virify can power a clean, modern online presence for smaller estate agents. It reuses the same listing cards and design system as the main platform, with a lightweight layout that feels like a dedicated website.',
      'When you\'re ready, we can swap these example listings for your own properties and connect enquiries straight into your preferred workflow.',
    ],
  },
  footer: {
    copyright:
      'All listings and enquiries can be seamlessly connected to your Virify account when you are ready.',
  },
} as const;
