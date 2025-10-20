/**
 * API route to fetch the Contact Page content from Sanity CMS.
 */
export default defineEventHandler(async (event): Promise<ContactPageResponse> => {
  try {
    const page: ContactPageResponse | null = await sanityClient.fetch(`
      *[_type == "contactPage"][0] {
        _id,
        _type,
        hero {
          title,
          subtitle
        },
        formSection {
          title,
          description
        },
        partnerSection {
          title,
          description,
          buttonText
        },
        interestedSection {
          title,
          description,
          buttonText
        },
        seo {
          metaTitle,
          metaDescription,
          keywords,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          canonicalUrl
        }
      }
    `)

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Contact Page not found'
      })
    }

    return page
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact page from Sanity'
    })
  }
})
