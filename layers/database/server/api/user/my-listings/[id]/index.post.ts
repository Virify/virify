import { z } from 'zod'

const togglePublishedSchema = z.object({
  published: z.boolean()
})

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse()
  
  try {
    const session = await requireUserSession(event)
    const userId = session?.user?.id
    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
    }

    const id = getRouterParam(event, "id")
    if (!id || isNaN(Number(id))) {
      throw createError({ statusCode: 400, statusMessage: "Invalid listing ID" })
    }

    const body = await readBody(event)
    const { published } = togglePublishedSchema.parse(body)

    return await toggleListingPublished(userId as number, Number(id), published)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({ 
        statusCode: 400, 
        statusMessage: "Invalid request data",
        data: error.issues
      })
    }
    return errorResponse(error, event)
  }
})
