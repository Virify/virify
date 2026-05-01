import type { User } from '#auth-utils'
import { Role } from '~~/layers/database/server/database/prisma/generated/enums'
import { asObject } from '#shared/utils'

const FALLBACK_ROLE = 'PUBLIC'

type ValidRole = Role
type FallbackRole = typeof FALLBACK_ROLE

/**
 *  Check if role is valid
 */
function getIsValidRole(role: unknown): role is ValidRole {
  if (!role || typeof role !== 'string') return false

  return Object.values(Role).includes(role as Role)
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