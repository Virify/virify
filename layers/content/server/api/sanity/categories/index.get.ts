/**
 * API route to fetch all active guide categories from Sanity CMS.
 * @returns A promise that resolves to an array of categories.
 */
export default defineEventHandler(async (): Promise<CategoriesResponse> => {
  try {
    const categories: CategoriesResponse = await sanityClient.fetch(`
      *[_type == "guideCategory" && isActive == true] | order(orderIndex asc) {
        _id,
        title,
        slug,
        description,
        heroImage,
        icon,
        orderIndex,
        isActive,
        "guideCount": count(*[_type == "guide" && isPublished == true && category._ref == ^._id])
      }[guideCount > 0]
    `)
    return categories
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories from Sanity'
    })
  }
})