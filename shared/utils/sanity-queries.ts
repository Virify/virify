/**
 * Centralized Sanity GROQ queries
 * All queries extracted from API endpoints to be used with useSanityQuery
 */

// Categories queries
export const categoriesQuery = `*[_type == "guideCategory" && isActive == true] | order(orderIndex asc) {
  _id,
  title,
  slug,
  description,
  heroImage,
  icon,
  orderIndex,
  isActive,
  "guideCount": count(*[_type == "guide" && isPublished == true && category._ref == ^._id])
}[guideCount > 0]`

export const categoryBySlugQuery = `*[_type == "guideCategory" && slug.current == $slug && isActive == true][0] {
  _id,
  _type,
  title,
  slug,
  description,
  heroImage,
  icon,
  orderIndex,
  isActive,
  "guides": *[_type == "guide" && isPublished == true && category._ref == ^._id] | order(orderIndex asc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    heroImage,
    icon,
    readTime,
    publishedAt,
    isFeatured,
    isPublished,
    tags,
    orderIndex
  }
}`

// Guide queries
// Note: No isPublished filter - perspective setting controls draft vs published content
export const guideBySlugQuery = `*[_type == "guide" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  heroImage,
  content[]{
    ...,
    _type == 'block' => {
      ..., 
      markDefs[]{
        ..., 
        _type == 'internalLink' => { 
          "reference": @.reference->{_id, title, 'slug': slug.current, 'category': category->{'slug': slug.current}}
        }
      }
    }
  },
  readTime,
  publishedAt,
  updatedAt,
  isFeatured,
  isPublished,
  tags,
  orderIndex,
  seo,
  category-> {
    _id,
    _type,
    title,
    slug,
    description,
    heroImage,
    icon,
    orderIndex,
    isActive
  }
}`

// Navigation query
export const navigationQuery = `*[_type == "guideCategory" && isActive == true] | order(orderIndex asc) {
  _id,
  title,
  slug,
  description,
  orderIndex,
  "guides": *[_type == "guide" && isPublished == true && category._ref == ^._id] | order(orderIndex asc) {
    _id,
    title,
    slug,
    excerpt
  }
}[count(guides) > 0]`

// Policy pages
export const termsQuery = `*[_type == "terms"][0] {
  _id,
  title,
  lastUpdated,
  content
}`

export const privacyQuery = `*[_type == "privacy"][0] {
  _id,
  title,
  lastUpdated,
  content
}`

export const cookieQuery = `*[_type == "cookie"][0] {
  _id,
  title,
  lastUpdated,
  content
}`

// CMS pages
export const waitingListPageQuery = `*[_type == "waitingListPage"][0] {
  _id,
  _type,
  hero {
    title,
    subtitle,
    description
  },
  formSection {
    title,
    description,
    buttonText
  },
  buyersBenefits {
    title,
    subtitle,
    features[] {
      icon,
      title,
      subtitle,
      description
    }
  },
  sellersBenefits {
    title,
    subtitle,
    features[] {
      icon,
      title,
      subtitle,
      description
    }
  },
  earlyAccessBenefits {
    title,
    subtitle,
    benefits[] {
      title,
      description,
      icon
    }
  },
  contactSection {
    title,
    subtitle,
    description,
    buttonText
  },
  finalCta {
    title,
    subtitle,
    description,
    buttonText
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    canonicalUrl
  }
}`

export const contactPageQuery = `*[_type == "contactPage"][0] {
  _id,
  _type,
  hero {
    title,
    subtitle
  },
  formSection {
    title,
    description
  },
  partnerSection {
    title,
    description,
    buttonText
  },
  interestedSection {
    title,
    description,
    buttonText
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    canonicalUrl
  }
}`
