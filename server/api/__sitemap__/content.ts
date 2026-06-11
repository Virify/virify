export default defineCachedEventHandler(
  async (event) => {
    try {
      const sanity = useSanity()

      const categories = await sanity.fetch(allContentCategoriesQuery)

      if (!categories || !Array.isArray(categories)) {
        return []
      }

      const urls: { loc: string }[] = []

      // Add the content index page
      urls.push({ loc: '/content' })

      for (const category of categories) {
        if (category.slug) {
          // Add category page
          urls.push({ loc: `/content/${category.slug}` })

          // Add individual page URLs
          if (Array.isArray(category.pages)) {
            for (const page of category.pages) {
              if (page.slug) {
                urls.push({ loc: `/content/${category.slug}/${page.slug}` })
              }
            }
          }
        }
      }

      return urls
    } catch (error) {
      console.error('Error fetching content URLs for sitemap:', error)
      return []
    }
  },
  {
    maxAge: 60 * 60, // 1 hour
    name: 'sitemap-content',
  }
)
