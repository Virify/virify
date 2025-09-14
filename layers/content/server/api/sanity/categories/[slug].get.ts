/**
 * API route to fetch a category by its slug from Sanity CMS, including its associated guides.
 * @param event The event object containing request details.
 * @returns A promise that resolves to the category data with guides.
 */
export default defineEventHandler(async (event): Promise<CategoryWithGuidesResponse> => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category slug is required'
    })
  }

  try {
    const category: CategoryWithGuidesResponse | null = await sanityClient.fetch(`
      *[_type == "guideCategory" && slug.current == $slug && isActive == true][0] {
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
      }
    `, { slug })

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    return category
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch category from Sanity'
    })
  }
})