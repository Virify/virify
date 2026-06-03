import type { H3Event, EventHandlerRequest } from 'h3'
import { useRole } from './useRole'

export async function useFeatureFlag(event: H3Event<EventHandlerRequest>) {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = await useRole(event)

  // @TODO temporary override to only allow create listing for EAs
  const createListing: boolean = (role === 'ADMIN') || !!(flags.createListing && role === 'AGENT')
  // End @TODO

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