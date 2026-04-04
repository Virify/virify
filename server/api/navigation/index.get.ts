import { joinURL, withTrailingSlash } from 'ufo'

interface GuideSlug {
  current?: string
  [key: string]: unknown
}

interface GuideCategory {
  _id?: string
  slug?: GuideSlug
  title?: string
  description?: string
  icon?: string
  guides?: GuideCategory[]
}

interface MenuItem {
  id?: string
  label?: string
  href?: string
  description?: string
  icon?: string
  isViewAll?: boolean
  type: 'link' | 'dropdown'
  children?: MenuItem[]
}

/**
 *  Extract current slug from category slug object
 */
function getSlugForGuide(slug?: GuideSlug) {
  const { current } = asObject(slug)

  if (typeof current !== 'string') return '#'

  return current
}

/**
 *  Recursively format guide categories
 */
function formatGuides(category: GuideCategory, parentSlug = '/guides/') {
  const { _id, title, description, slug, icon } = asObject(category)

  const currentSlug = getSlugForGuide(slug)
  const fullSlug = joinURL(parentSlug, currentSlug)
  const fullSlugWithSlash = withTrailingSlash(fullSlug, true)

  // Format guides to correct structure
  const formattedCategory: MenuItem = {
    id: _id,
    label: title,
    description: description,
    icon: icon || 'article',
    type: 'link',
  }

  // If the guides has any children, format and append them as well
  if (Array.isArray(category.guides)) {
    formattedCategory.type = 'dropdown'
    formattedCategory.children = [
      {
        href: fullSlugWithSlash,
        label: `View All`,
        type: 'link',
        isViewAll: true
      },
      ...category.guides.map((child) => {
        return formatGuides(child, fullSlugWithSlash)
      })
    ]
  }
  // Otherwise the category is a link, so include the href
  else {
    formattedCategory.href = fullSlugWithSlash
  }

  return formattedCategory
}

export default defineCachedEventHandler(async () => {
  const { isWaitingList } = useRuntimeConfig().public

  const baseNavigation: MenuItem[] = [
    {
      id: "home",
      label: "Home",
      type: "link",
      href: "/",
    },
    {
      id: "guides",
      label: "Guides",
      href: "/guides",
      type: "dropdown",
      children: [],
    },
    {
      id: "property-info",
      label: "Tools",
      type: "dropdown",
      children: [
        {
          id: "price-paid",
          label: "Price paid data",
          href: "/price-paid/",
          icon: "account/billing",
          type: 'link'
        },
      ]
    },
    {
      id: "support",
      label: "Support",
      href: "/support/",
      type: "link",
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact/",
      type: "link",
    },
  ];

  // If is waiting list, add waiting list URL to nav
  if (!isWaitingList) {
    for (let dropdown of baseNavigation) {
      if (dropdown.id !== 'property-info') continue

      dropdown.children?.push({
        id: "mortgage-calculator",
        label: "Mortgage Calculator",
        href: "/mortgage-calculator/",
        icon: "account/billing",
        type: 'link'
      })
    }
  }

  // Get active guide pages
  const guides = await useSanity().fetch(navigationQuery)

  // If no guides, remove 'guides' from nav and return
  if (!Array.isArray(guides) || !guides.length) {
    return baseNavigation.filter(({ id }) => id !== 'guides')
  }

  // Else format the guides
  const formattedGuides = guides.map(category => {
    return formatGuides(category)
  })

  // Then append the guides to the menu
  for (let dropdown of baseNavigation) {
    if (dropdown.id !== 'guides') continue

    dropdown.children?.push(...formattedGuides)
  }


  return baseNavigation
}, {
  maxAge: 86400 // 24 hours (60*60*24)
})