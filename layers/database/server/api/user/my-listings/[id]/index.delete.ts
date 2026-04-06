import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

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

    console.log(`[DELETE /api/user/my-listings/${id}] Archiving listing for user ${userId}`)
    
    const result = await archiveListing(userId as number, Number(id))
    
    console.log(`[DELETE /api/user/my-listings/${id}] Successfully archived:`, result)
    
    // Clear the listing cache when archived
    const storage = useStorage('cache:listing')
    await storage.removeItem(`listing:${id}`)
    await invalidateAggregatesCache(userId as number)
    
    // Send websocket update for listings count change
    try {
      const { sendMessage, createAggregateUpdateMessage } = useWebSocketServer()
      sendMessage(createAggregateUpdateMessage("listings", "remove", userId as number))
      sendMessage(createAggregateUpdateMessage("archivedListings", "add", userId as number))
    } catch (error) {
      console.warn(`[DELETE /api/user/my-listings/${id}] WebSocket update failed (non-critical):`, error)
    }
    
    return result
  } catch (error) {
    console.error('[DELETE /api/user/my-listings/[id]] Error archiving listing:', error)
    return errorResponse(error, event)
  }
})
