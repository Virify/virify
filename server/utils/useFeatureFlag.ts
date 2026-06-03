import type { H3Event, EventHandlerRequest } from 'h3'
import { useRole } from './useRole'

export async function useFeatureFlag(event: H3Event<EventHandlerRequest>) {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = await useRole(event)

  // Only ADMIN or AGENT (Estate Agent) roles can create a listing
  const createListing: boolean = (role === 'ADMIN') || !!(flags.createListing && role === 'AGENT')

  return {
    ...flags,
    createListing,
    role,
    roleActive,
    isAdmin,
    isAgent,
    checkFeatureFlag
  }
}