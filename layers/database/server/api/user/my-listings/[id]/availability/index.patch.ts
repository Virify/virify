import { z } from 'zod'
import { SaleAvailabilityStatus, RentalAvailabilityStatus } from '~~/layers/database/server/database/prisma/generated/client'
import { invalidateListingCache } from '~~/layers/database/server/utils/listing-cache'

const availabilitySchema = z.object({
  availabilityStatus: z.enum({ ...SaleAvailabilityStatus, ...RentalAvailabilityStatus }),
})

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse()

  try {
    const session = await requireUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const id = getRouterParam(event, 'id')
    if (!id || isNaN(Number(id))) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid listing ID' })
    }

    const body = await readBody(event)
    const { availabilityStatus } = availabilitySchema.parse(body)

    await updateListingAvailabilityStatus(userId as number, Number(id), availabilityStatus)
    // Bust the public listing page cache so availability shows immediately
    await invalidateListingCache(Number(id))

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid availability status',
        data: error.issues,
      })
    }
    return errorResponse(error, event)
  }
})
