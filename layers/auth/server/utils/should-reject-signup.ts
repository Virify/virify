import type { UserWithVerification } from "~~/layers/database/server/utils/user";

/**
 * Check if the owner is active or is agent.
 * @param user User
 * @returns Boolean
 */
export function shouldRejectSignup(user: UserWithVerification): Boolean {
  return isActive(user);
}
