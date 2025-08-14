import type { SearchStateParams, SearchStateResponse } from '../../shared/types/search-state'

export default defineEventHandler(async (event): Promise<SearchStateResponse> => {
  const query = getQuery<SearchStateParams>(event)
  let sessionId = query.sessionId
  
  // Handle beacon requests from beforeunload
  if (!sessionId && event.node.req.method === 'POST') {
    try {
      const body = await readBody(event)
      if (body._method === 'DELETE' && query.sessionId) {
        sessionId = query.sessionId
      }
    } catch {
      // Ignore body parsing errors for beacon requests
    }
  }
  
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }
  
  const storage = useStorage('kv')
  const key = `search-state:${sessionId}`
  
  try {
    await storage.removeItem(key)
    console.log('🗑️ KV cleaned up on tab close:', sessionId)
    return { success: true }
  } catch (error) {
    console.error('Failed to clear search state:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear search state'
    })
  }
})