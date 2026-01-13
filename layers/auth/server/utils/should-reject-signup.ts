/**
 * Check if the user is active or is agent.
 * @param user User
 * @returns Boolean
 */
export function shouldRejectSignup(user: UserWithVerification): Boolean {
  return isActive(user);
}
