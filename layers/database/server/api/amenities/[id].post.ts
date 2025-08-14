import { z } from 'zod'

const AmenitySchema = z.object({
  type: z.enum(['EDUCATION', 'HEALTHCARE', 'TRANSPORT']),
  subtype: z.enum(['SCHOOL', 'HOSPITAL', 'TRAIN_STATION']).optional(),
  name: z.string(),
  distanceM: z.number(),
  description: z.string().optional().nullable(),
  location: z.any().optional().nullable(),
})

const AmenitiesRequestSchema = z.object({
  amenities: z.array(AmenitySchema)
})

export default defineEventHandler(async (event) => {
  try {
    const propertyId = getRouterParam(event, 'id')
    
    if (!propertyId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Property ID is required'
      })
    }

    const body = await readBody(event)
    const { amenities } = AmenitiesRequestSchema.parse(body)

    // First check if amenities already exist for this property
    const existingAmenities = await getAmenitiesByPropertyId(parseInt(propertyId))
    
    if (existingAmenities.length > 0) {
      // Amenities already exist, just clear cache and return existing ones
      const cacheKey = `amenities:property:${propertyId}`;
      await useStorage().removeItem(cacheKey);
      
      return {
        success: true,
        count: existingAmenities.length,
        amenities: existingAmenities,
        message: 'Amenities already exist for this property'
      }
    }

    // Create amenities for this property only if none exist
    const createdAmenities = await createAmenitiesForProperty(parseInt(propertyId), amenities)

    // Clear the cache since we now have amenities for this property
    const cacheKey = `amenities:property:${propertyId}`;
    await useStorage().removeItem(cacheKey);

    return {
      success: true,
      count: createdAmenities.length,
      amenities: createdAmenities
    }

  } catch (error) {
    console.error('Error saving amenities:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save amenities'
    })
  }
})