/**
 * Check if the user is activated.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  // Extract email and token from the query parameters
  const { email, token } = await getQuery(event);
  const { successResponse } = useResponse();

  try {
    // Find the user by email
    const user = await findOwnerWithVerification(email as string);

    // Throw an error if the user is not found
    if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

    // Throw an error if the user is an agent or already activated
    if (shouldRejectSignup(user)) throw createError({ statusCode: 403, statusMessage: "User already activated, or is agent!" });

    // Validate the token
    validateActivationToken(user, token as string);

    return successResponse("User not activated");
  } catch (error) {
    return error;
  }
});

/**
 * Validates the activation token.
 * @param user - The user object.
 * @param token - The activation token to validate.
 * @throws An error if the token is invalid or expired.
 */
function validateActivationToken(user: any, token: string) {
  // Throw an error if the token is invalid or expired
  if (user.verification?.activationToken && user.verification?.activationTokenExpiry < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Invalid token" });
  }

  // Validate the token
  validateToken(token, user);
}