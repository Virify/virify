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

    // Group amenities by type
    const groupedAmenities = {
      schools: amenities.filter(a => a.type === 'EDUCATION').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'schools'
      })),
      hospitals: amenities.filter(a => a.type === 'HEALTHCARE').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'hospitals'
      })),
      shops: amenities.filter(a => a.type === 'SHOPPING_ENTERTAINMENT').map(a => ({
        name: a.name,
        distance: a.distanceM,
        type: 'shops'
      }))
    }

    return {
      exists: amenities.length > 0,
      amenities: groupedAmenities,
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