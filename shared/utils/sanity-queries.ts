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
    _updatedAt,
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
  _updatedAt,
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

export const acceptableUseQuery = `*[_type == "acceptableUse"][0] {
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
    subtitle
  },
  formSection {
    title,
    description,
    buttonText
  },
  featureSections[] {
    title,
    subtitle,
    features[] {
      icon,
      title,
      description
    },
    imageType,
    imageSource,
    image,
    imageAlt,
    sanityImage,
    overlaidImagesSource,
    overlaidImages,
    overlaidSanityImages,
    imagePosition,
    background,
    iconColor
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
      variant
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
  guidesSection {
    title,
    description,
    guides[]-> {
      _id,
      _updatedAt,
      title,
      slug,
      excerpt,
      heroImage,
      icon,
      readTime,
      publishedAt,
      orderIndex,
      category-> {
        _id,
        title,
        slug
      }
    }
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
  pressFormSection {
    title,
    description
  },
  faqSection {
    title,
    description,
    faqs[]-> {
      _id,
      question,
      answer,
      active
    }
  },
  guidesSection {
    title,
    description,
    guides[]-> {
      _id,
      _updatedAt,
      title,
      slug,
      excerpt,
      heroImage,
      icon,
      readTime,
      publishedAt,
      orderIndex,
      category-> {
        _id,
        title,
        slug
      }
    }
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

export const supportPageQuery = `*[_type == "supportPage"][0] {
  _id,
  _type,
  hero {
    title,
    subtitle
  },
  faqSection {
    title,
    description,
    faqs[]-> {
      _id,
      question,
      answer,
      active
    }
  },
  ourSupportSection {
    title,
    subtitle,
    benefits[] {
      title,
      description,
      variant
    }
  },
  whatWeDontSupportSection {
    title,
    description,
    faqs[]-> {
      _id,
      question,
      answer,
      active
    }
  },
  SupportFormSection {
    title,
    description
  },
  ctaSection {
    title,
    description,
    buttonText,
    buttonLink
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

export const generalPageQuery = `*[_type == "generalPage" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  caption,
  description,
  
  // 1. TOP OF PAGE: Hero CTA Buttons
  heroButtons[] {
    _key,
    label,
    icon,
    url,
    signup,
    login
  },
  
  // 2. MIDDLE OF PAGE: Dynamic Orderable Sections Array
  sections[] {
    _key,
    _type,
    
    // Standard Info Layout
    _type == "pageSection" => {
      headline,
      title,
      description,
      reverse,
      orientation,
      "image": image.asset->url,
      features[] {
        _key,
        title,
        description,
        icon,
        iconColor
      }
    },

    // Dedicated Page Call-To-Action (CTA) Block
    _type == "pageCta" => {
      title,
      description,
      buttons[] {
        _key,
        label,
        url,
        signup,
        icon
      }
    },

    // Referenced FAQs List
    _type == "reference" => @-> {
      "id": _id,
      "_type": "faq",
      question,
      answer,
      active
    }
  },

  // 3. Technical SEO Configurations
  "seo": {
    "title": coalesce(seoTitle, title),
    "description": coalesce(seoDescription, description),
    noIndex
  }
}`
