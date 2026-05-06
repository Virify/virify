import type { H3Event, EventHandlerRequest } from 'h3'
import { getRole, getRoleActive } from '#shared/utils/get-role'

export async function useRole(event: H3Event<EventHandlerRequest>) {
  const { user } = await getUserSession(event)

  const role = getRole(user)
  const roleActive = getRoleActive(user)

  return {
    role,
    roleActive,
    isAdmin: role === 'ADMIN',
    isAgent: role === 'AGENT'
  }
}