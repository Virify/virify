export default defineEventHandler(async (event) => {
  try {
    const propertyId = getRouterParam(event, 'id')
    
    if (!propertyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Property ID is required'
      })
    }

    // Create cache key from property ID
    const cacheKey = `amenities:property:${propertyId}`;

    // Try to get from cache first
    const cached = await useStorage().getItem(cacheKey);
    if (cached) {
      return cached;
    }

    // Get amenities for this property
    const amenities = await getAmenitiesByPropertyId(parseInt(propertyId))

    // Return a flat array of amenities
    const result = {
      exists: amenities.length > 0,
      amenities,
      lastUpdated: amenities.length > 0 ? amenities[0]?.createdAt : null
    }

    // Cache the result for 30 days (amenities data doesn't change frequently)
    await useStorage().setItem(cacheKey, result, {
      ttl: 60 * 60 * 24 * 30 // 30 days in seconds
    });

    return result;

  } catch (error) {
    console.error('Error fetching amenities:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch amenities'
    })
  }
})