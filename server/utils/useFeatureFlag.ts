import type { H3Event, EventHandlerRequest } from 'h3'
import { useRole } from './useRole'

export async function useFeatureFlag(event: H3Event<EventHandlerRequest>) {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = await useRole(event)

  return {
    ...flags,
    role,
    roleActive,
    isAdmin,
    isAgent
  }
}