/**
 * API route to fetch the Terms & Conditions from Sanity CMS.
 */
export default defineEventHandler(async (event): Promise<TermsResponse> => {
  try {
    const terms: TermsResponse | null = await sanityClient.fetch(`
      *[_type == "terms"][0] {
        _id,
        _type,
        title,
        slug,
        content,
        updatedAt
      }
    `)

    if (!terms) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Terms & Conditions not found'
      })
    }

    return terms
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch terms from Sanity'
    })
  }
})
