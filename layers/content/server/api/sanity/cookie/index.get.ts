/**
 * API route to fetch the Cookie Policy from Sanity CMS.
 */
export default defineEventHandler(async (event): Promise<CookieResponse> => {
  try {
    const cookie: CookieResponse | null = await sanityClient.fetch(`
      *[_type == "cookie"][0] {
        _id,
        _type,
        title,
        slug,
        content,
        updatedAt
      }
    `)

    if (!cookie) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Cookie Policy not found'
      })
    }

    return cookie
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch cookie policy from Sanity'
    })
  }
})
