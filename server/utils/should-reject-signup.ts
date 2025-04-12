import { OwnerRole, Prisma } from "@prisma/client";

/**
 * Check if the owner is active or is agent.
 * @param user User
 * @returns Boolean
 */
export function shouldRejectSignup(user: Prisma.OwnerGetPayload<{ include: { verification: true } }>): Boolean {
  return isActive(user);
}

/**
 * Check if the owner is active or is user.
 * @param user Owner
 * @returns Boolean
 */
export function shouldRejectAgentSignup(user: Prisma.OwnerGetPayload<{ include: { verification: true } }>): Boolean {
  return isActive(user) || hasRole(user, OwnerRole.USER);
}
