export default defineEventHandler(async (event) => {
  try {
    const propertyId = getRouterParam(event, 'id')
    
    if (!propertyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Property ID is required'
      })
    }

    // Get amenities for this property
    const amenities = await getAmenitiesByPropertyId(parseInt(propertyId))

    // Return a flat array of amenities
    return {
      exists: amenities.length > 0,
      amenities,
      lastUpdated: amenities.length > 0 ? amenities[0]?.createdAt : null
    }

  } catch (error) {
    console.error('Error fetching amenities:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch amenities'
    })
  }
})