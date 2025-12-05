
/**
 * Sanity CMS Types
 * These types match our Sanity schema definitions
 */

// Base Sanity types
export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImage {
  _type?: 'image'
  asset: {
    _ref?: string
    _id?: string
    _type?: 'reference'
    url?: string
  }
  alt?: string
  caption?: string
}

export interface SanityReference {
  _ref: string
  _type: 'reference'
}

// Portable Text types
export interface PortableTextBlock {
  _key: string
  _type: 'block'
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
  children: PortableTextChild[]
  markDefs?: PortableTextMarkDef[]
  level?: number
  listItem?: 'bullet' | 'number'
}

export interface PortableTextChild {
  _key: string
  _type: 'span'
  text: string
  marks?: string[]
}

export interface PortableTextMarkDef {
  _key: string
  _type: string
  href?: string
}

export interface PortableTextImageBlock {
  _key: string
  _type: 'image'
  asset: SanityImage['asset']
  alt?: string
  caption?: string
}

export interface PortableTextTableBlock {
  _key: string
  _type: 'table'
  caption?: string
  rows: {
    cells: string[]
    isHeader?: boolean
  }[]
}

export interface PortableTextCalloutBlock {
  _key: string
  _type: 'callout'
  type: 'info' | 'warning' | 'success' | 'error' | 'tip'
  content?: PortableTextContent[]
}

export type PortableTextContent = 
  | PortableTextBlock 
  | PortableTextImageBlock 
  | PortableTextTableBlock 
  | PortableTextCalloutBlock

// Guide Category
export interface GuideCategory {
  _id: string
  _type: 'guideCategory'
  title: string
  slug: SanitySlug
  description?: string
  heroImage?: SanityImage
  icon?: string
  orderIndex: number
  isActive: boolean
  guideCount?: number
  guides?: Guide[]
}

// Guide
export interface Guide {
  _id: string
  _type: 'guide'
  title: string
  slug: SanitySlug
  excerpt?: string
  content?: PortableTextContent[]
  heroImage?: SanityImage
  icon?: string
  category?: GuideCategory | SanityReference
  readTime?: number
  publishedAt?: string
  updatedAt?: string
  isFeatured: boolean
  isPublished: boolean
  tags?: string[]
  orderIndex: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: SanityImage
  }
}

// API Response types
export interface CategoriesResponse extends Array<GuideCategory> {}

export interface CategoryWithGuidesResponse extends GuideCategory {
  guides: Guide[]
}

export interface GuideResponse extends Guide {
  category?: GuideCategory
}

// Guide with dereferenced category (used in queries with category->)
export interface GuideWithCategory extends Omit<Guide, 'category'> {
  category?: GuideCategory
}

export interface SanityGuideCategory {
  _id: string
  title: string
  slug?: { current?: string }
  description?: string
  guides?: SanityGuide[]
}

export interface SanityGuide {
  _id: string
  title: string
  slug?: { current?: string }
  excerpt?: string
  icon?: string
}

// Legal Documents
export interface Terms {
  _id: string
  _type: 'terms'
  title: string
  slug: SanitySlug
  content?: PortableTextContent[]
  updatedAt?: string
}

export interface Privacy {
  _id: string
  _type: 'privacy'
  title: string
  slug: SanitySlug
  content?: PortableTextContent[]
  updatedAt?: string
}

export interface Cookie {
  _id: string
  _type: 'cookie'
  title: string
  slug: SanitySlug
  content?: PortableTextContent[]
  updatedAt?: string
}

export interface TermsResponse extends Terms {}

export interface PrivacyResponse extends Privacy {}

export interface CookieResponse extends Cookie {}

// Policy page union type for convenience
export interface PolicyPage {
  _id: string
  title: string
  lastUpdated: string
  content: PortableTextContent[]
}

// Waiting List Page
export interface WaitingListFeature {
  icon: string
  title: string
  subtitle: string
  description: string
}

export interface WaitingListBenefit {
  title: string
  description: string
  icon?: string
}

// Feature Section (reusable component)
export interface FeatureSectionFeature {
  icon: string
  title: string
  description: string
}

export interface OverlaidImages {
  rear: string
  rearAlt: string
  front: string
  frontAlt: string
}

export interface OverlaidSanityImages {
  rear: SanityImage
  front: SanityImage
}

export interface FeatureSection {
  title: string
  subtitle: string
  features: FeatureSectionFeature[]
  imageType: 'single' | 'overlaid'
  imageSource?: 'cloudflare' | 'sanity'
  image?: string
  imageAlt?: string
  sanityImage?: SanityImage
  overlaidImagesSource?: 'cloudflare' | 'sanity'
  overlaidImages?: OverlaidImages
  overlaidSanityImages?: OverlaidSanityImages
  imagePosition: 'left' | 'right'
  background: 'white' | 'gradient'
  iconColor: 'orange' | 'blue'
}

export interface SeoMetadata {
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonicalUrl?: string
}

export interface WaitingListPage {
  _id: string
  _type: 'waitingListPage'
  hero: {
    title: string
    subtitle: string
  }
  formSection: {
    title: string
    description: string
    buttonText: string
  }
  featureSections?: FeatureSection[]
  buyersBenefits: {
    title: string
    subtitle: string
    features: WaitingListFeature[]
  }
  sellersBenefits: {
    title: string
    subtitle: string
    features: WaitingListFeature[]
  }
  earlyAccessBenefits: {
    title: string
    subtitle: string
    benefits: WaitingListBenefit[]
  }
  contactSection: {
    title: string
    subtitle: string
    description: string
    buttonText: string
  }
  finalCta: {
    title: string
    subtitle: string
    description: string
    buttonText: string
  }
  seo?: SeoMetadata
}

export interface WaitingListPageResponse extends WaitingListPage {}

// Contact Page
export interface ContactPage {
  _id: string
  _type: 'contactPage'
  hero: {
    title: string
    subtitle: string
  }
  formSection: {
    title: string
    description: string
  }
  interestedSection: {
    title: string
    description: string
    buttonText: string
  }
  pressFormSection: {
    title: string
    description: string
  }
  partnerSection: {
    title: string
    description: string
    buttonText: string
  }
  faqSection: {
    title: string
    description: string
    faqs: {
      _id: string
      question: string
      answer: string
      active: boolean
    }[]
  }
  seo?: SeoMetadata
}

export interface ContactPageResponse extends ContactPage {}
