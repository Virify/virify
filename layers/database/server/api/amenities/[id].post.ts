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

    // Create amenities for this property
    const createdAmenities = await createAmenitiesForProperty(parseInt(propertyId), amenities)

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