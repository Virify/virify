import { OwnerRole, Prisma } from "@prisma/client";

/**
 * Check if the owner is active or is agent.
 * @param user User
 * @returns Boolean
 */
export default function shouldRejectSignup(user: Prisma.OwnerGetPayload<{ include: { verification: true } }>): Boolean {
  return isActive(user) || hasRole(user, OwnerRole.AGENT);
};