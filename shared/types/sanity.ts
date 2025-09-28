
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
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
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