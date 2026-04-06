import { z } from 'zod'
import { useWebSocketServer } from '~~/layers/websocket/composables/useWebSocketServer'

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

    const { result, wasDraft, isDraft } = await toggleListingPublished(userId as number, Number(id), published)
    
    // Clear the listing cache when published status changes
    const storage = useStorage('cache:listing')
    await storage.removeItem(`listing:${id}`)
    
    // If draft status changed, send aggregate update
    if (wasDraft !== isDraft) {
      try {
        const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()
        const aggregateMessage = createAggregateUpdateMessage("listings", "update", userId)
        sendMessage(aggregateMessage)
      } catch (error) {
        console.warn(`[POST /api/user/my-listings/${id}] WebSocket update failed (non-critical):`, error)
      }
    }
    
    return result
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
