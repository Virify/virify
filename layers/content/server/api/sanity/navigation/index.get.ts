/**
 * API route to fetch categories with their guides for navigation purposes.
 * @returns A promise that resolves to an array of categories with nested guides.
 */
export default defineEventHandler(async () => {
  try {
    const categoriesWithGuides = await sanityClient.fetch(`
      *[_type == "guideCategory" && isActive == true] | order(orderIndex asc) {
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
      }[count(guides) > 0]
    `)
    return categoriesWithGuides
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch navigation data from Sanity'
    })
  }
})