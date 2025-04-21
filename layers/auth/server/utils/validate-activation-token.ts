import type { UserWithVerification } from "~~/layers/database/server/utils/user";

/**
 * Validate the activation token and check if it is expired.
 *
 * Ensures that:
 * - The activation token is present.
 * - The provided activation token matches the stored token.
 * - The activation token has not expired.
 *
 * @param verification - The user's verification object containing activation details.
 * @param token - The activation token provided by the user.
 * @throws Will throw an error if the token is missing, does not match, or has expired.
 */
export default function validateActivationToken(user: UserWithVerification, token?: string) {
  const now = new Date();

  if (shouldRejectSignup(user)) {
    throw createError({ statusCode: 403, statusMessage: "User already activated" });
  }

  if (!user.verification) {
    throw createError({ statusCode: 404, statusMessage: "Invalid Token" });
  }

  if (user.verification.activationToken !== token) {
    throw createError({ statusCode: 400, statusMessage: "Activation token does not match, try signing up again" });
  }

  if (user.verification.activationTokenExpiry && user.verification.activationTokenExpiry < now) {
    throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
  }
}