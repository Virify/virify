export default defineEventHandler(async (event) => {
  try {
    const sanity = useSanity()
    
    const categoriesWithGuides = await sanity.fetch(navigationQuery)
    
    if (!categoriesWithGuides || !Array.isArray(categoriesWithGuides)) {
      return []
    }
    
    const urls: any[] = []
    
    // Add all category and guide URLs
    for (const category of categoriesWithGuides) {
      if (category.slug?.current) {
        // Add category page
        urls.push({
          loc: `/guides/${category.slug.current}`,
        })
        
        // Add individual guide pages
        if (category.guides && Array.isArray(category.guides)) {
          for (const guide of category.guides) {
            if (guide.slug?.current) {
              urls.push({
                loc: `/guides/${category.slug.current}/${guide.slug.current}`,
              })
            }
          }
        }
      }
    }
    
    return urls
  } catch (error) {
    console.error('Error fetching guide URLs for sitemap:', error)
    return []
  }
})
