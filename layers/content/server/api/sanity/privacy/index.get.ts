/**
 * API route to fetch the Privacy Policy from Sanity CMS.
 */
export default defineEventHandler(async (event): Promise<PrivacyResponse> => {
  try {
    const privacy: PrivacyResponse | null = await sanityClient.fetch(`
      *[_type == "privacy"][0] {
        _id,
        _type,
        title,
        slug,
        content,
        updatedAt
      }
    `)

    if (!privacy) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Privacy Policy not found'
      })
    }

    return privacy
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch privacy policy from Sanity'
    })
  }
})
