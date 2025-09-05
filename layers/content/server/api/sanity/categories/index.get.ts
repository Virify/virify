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
        isActive
      }
    `)
    return categories
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories from Sanity'
    })
  }
})