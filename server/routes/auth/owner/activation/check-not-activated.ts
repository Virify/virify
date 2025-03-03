/**
 * Endpoint to check if a user is activated.
 *
 * This handler verifies the user's activation status based on the provided email and activation token.
 * If the user is found but not activated, it checks whether the activation token is valid and not expired.
 *
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response indicating whether the user is activated.
 */
export default defineEventHandler(async (event) => {
  // Extract email and activation token from query parameters
  const { email, token } = await getQuery(event);
  const { successResponse } = useResponse();

  try {
    // Retrieve the user along with their verification details
    const user = await findOwnerWithVerification(email as string);

    // If the user does not exist or has no verification details, return a 404 error
    if (!user?.verification) {
      throw createError({ statusCode: 404, statusMessage: "User not found or verification status missing" });
    }

    // If the user is an agent or already activated, reject the request
    if (shouldRejectSignup(user)) {
      throw createError({ statusCode: 403, statusMessage: "User already activated, or is an agent!" });
    }

    // Validate the activation token and its expiration date
    validateActivationToken(user.verification, token as string);

    return successResponse("User not activated");
  } catch (error) {
    return error;
  }
});

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
function validateActivationToken(verification: { activationToken: string | null; activationTokenExpiry?: Date | null }, token?: string) {
  // Ensure the activation token exists
  if (!verification.activationToken) {
    throw createError({ statusCode: 400, statusMessage: "Activation token is missing, try signing up again" });
  }

  // Check if the provided token matches the stored activation token
  if (verification.activationToken !== token) {
    throw createError({ statusCode: 400, statusMessage: "Activation token does not match, try signing up again" });
  }

  // Check if the activation token has expired
  if (verification.activationTokenExpiry && new Date(verification.activationTokenExpiry) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
  }
}
