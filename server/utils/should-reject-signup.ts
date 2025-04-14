import { OwnerRole } from "~~/layers/database/server/utils/owner";
/**
 * Check if the owner is active or is agent.
 * @param user User
 * @returns Boolean
 */
export function shouldRejectSignup(user: OwnerWithVerification): Boolean {
  return isActive(user);
}

/**
 * Check if the owner is active or is user.
 * @param user Owner
 * @returns Boolean
 */
export function shouldRejectAgentSignup(user: OwnerWithVerification): Boolean {
  return isActive(user) || hasRole(user, OwnerRole.USER);
}
