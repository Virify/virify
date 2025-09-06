/**
 * API route to fetch a single guide by its slug from Sanity CMS.
 * @param event The event object containing request details.
 * @returns A promise that resolves to the guide data.
 */
export default defineEventHandler(async (event): Promise<GuideResponse> => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Guide slug is required'
    })
  }

  try {
    const guide: GuideResponse | null = await sanityClient.fetch(`
      *[_type == "guide" && slug.current == $slug && isPublished == true][0] {
        _id,
        _type,
        title,
        slug,
        excerpt,
        heroImage,
        content,
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
      }
    `, { slug })

    if (!guide) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Guide not found'
      })
    }

    return guide
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch guide from Sanity'
    })
  }
})