import type { User } from '#auth-utils'
import { asObject } from '#shared/utils'

const VALID_ROLES = ['ADMIN', 'AGENT', 'USER'] as const
const FALLBACK_ROLE = 'PUBLIC'

type ValidRole = (typeof VALID_ROLES)[number]
type FallbackRole = typeof FALLBACK_ROLE

/**
 *  Check if role is valid
 */
function getIsValidRole(role: unknown): role is ValidRole {
  if (!role || typeof role !== 'string') return false

  return VALID_ROLES.includes(role as ValidRole)
}

/**
 *  Get validated user role
 */
export function getRole(user?: User | null): ValidRole | FallbackRole {
  const { role } = asObject(user)

  // If the role is invalid, return fallback
  if (!getIsValidRole(role)) {
    return FALLBACK_ROLE
  }

  // Return user role
  return role
}

/**
 *  Get whether user has activated their account
 */
export function getRoleActive(user?: User | null): boolean {
  const { activated } = asObject(user)

  return !!activated
}