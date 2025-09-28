export const mapSanityGuidesToNavigationChildren = (categories: SanityGuideCategory[]): NavigationSubItem[] =>
  categories.map((category) => {
    const categorySlug = category.slug?.current ?? ''

    return {
      id: category._id,
      label: category.title,
      href: categorySlug ? `/guides/${categorySlug}` : '#',
      description: category.description,
      icon: 'article',
      children:
        category.guides?.map((guide) => ({
          id: guide._id,
          label: guide.title,
          href: categorySlug && guide.slug?.current
            ? `/guides/${categorySlug}/${guide.slug.current}`
            : '#',
          description: guide.excerpt,
          icon: guide.icon,
        })) ?? [],
    }
  })
