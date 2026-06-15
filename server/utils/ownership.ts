import type { User } from "#auth-utils";

/**
 * Returns a Prisma where clause for ownership verification.
 * If the user is an ADMIN, it omits the userId check to allow full access.
 *
 * Usage in Prisma:
 * where: { id: listingId, ...getOwnershipFilter(user) }
 */
export function getOwnershipFilter(user: User) {
  return user.role === "ADMIN" ? {} : { userId: user.id };
}
