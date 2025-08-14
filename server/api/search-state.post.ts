import type { SaveSearchStateRequest, SearchStateResponse } from '../../shared/types/search-state'

export default defineEventHandler(async (event): Promise<SearchStateResponse> => {
  const body = await readBody<SaveSearchStateRequest>(event)
  const { sessionId, state } = body
  
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }
  
  const storage = useStorage('kv')
  const key = `search-state:${sessionId}`
  
  try {
    // Store without TTL since we cleanup on tab close
    await storage.setItem(key, state)
    return { success: true }
  } catch (error) {
    console.error('Failed to save search state:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save search state'
    })
  }
})