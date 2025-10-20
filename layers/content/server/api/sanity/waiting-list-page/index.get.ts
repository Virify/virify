/**
 * API route to fetch the Waiting List Page content from Sanity CMS.
 */
export default defineEventHandler(async (event): Promise<WaitingListPageResponse> => {
  try {
    const page: WaitingListPageResponse | null = await sanityClient.fetch(`
      *[_type == "waitingListPage"][0] {
        _id,
        _type,
        hero {
          title,
          subtitle,
          description
        },
        formSection {
          title,
          description,
          buttonText
        },
        buyersBenefits {
          title,
          subtitle,
          features[] {
            icon,
            title,
            subtitle,
            description
          }
        },
        sellersBenefits {
          title,
          subtitle,
          features[] {
            icon,
            title,
            subtitle,
            description
          }
        },
        earlyAccessBenefits {
          title,
          subtitle,
          benefits[] {
            title,
            description,
            icon
          }
        },
        contactSection {
          title,
          subtitle,
          description,
          buttonText
        },
        finalCta {
          title,
          subtitle,
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
        statusMessage: 'Waiting List Page not found'
      })
    }

    return page
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch waiting list page from Sanity'
    })
  }
})

