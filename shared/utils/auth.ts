import { Role } from "~~/layers/database/server/database/prisma/generated/enums"
import type { User } from "#auth-utils"

/**
 * Check if user is logged in
 * 
 * @param user UserWithVerificationAndMembership
 * @returns Boolean
 */
export const isLoggedIn = (user: User): boolean => {
  return !!user && !!user.id
}

/**
 * Check if user is logged in and is an admin
 * 
 * @param user UserWithVerificationAndMembership
 * @returns Boolean
 */
export const isAdmin = (user: User): boolean => {
  return isLoggedIn(user) && user?.role === "ADMIN"
}

/**
 * Check if user is verified
 * @param user User
 * @returns Boolean
 */
export const isVerified = (user: User | null): boolean => {
  return !!user && isLoggedIn(user) && user?.activated === 'ACTIVATED'
}