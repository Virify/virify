import type { SearchState, SearchStateParams } from '../../shared/types/search-state'

export default defineEventHandler(async (event): Promise<SearchState | null> => {
  const query = getQuery<SearchStateParams>(event)
  const sessionId = query.sessionId
  
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }
  
  const storage = useStorage('kv')
  const key = `search-state:${sessionId}`
  
  try {
    const state = await storage.getItem<SearchState>(key)
    return state || null
  } catch (error) {
    console.error('Failed to get search state:', error)
    return null
  }
})