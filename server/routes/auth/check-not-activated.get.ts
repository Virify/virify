/**
 * Endpoint to check if a user or agent is activated.
 *
 * This handler verifies the activation status based on the provided email and activation token.
 * It differentiates between users and agents and ensures the activation token is valid and not expired.
 *
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response indicating whether the entity is activated.
 */
export default defineEventHandler(async (event) => {
  // Extract email and activation token from query parameters
  const { email, token, role } = await getQuery(event);
  const { successResponse } = useResponse();

  try {
    // Determine if we're checking an agent or a user
    const isAgent = role === "agent";

    // get the user with the email
    const user = await findOwnerWithVerification(email as string);

    // Validate the user and their verification status
    if (!user?.verification) {
      throw createError({ statusCode: 404, statusMessage: `${isAgent ? "Agent" : "User"} not found or verification status missing` });
    }

    // if user is agent and tries to activate on user account reject and vice versa
    if (isAgent ? shouldRejectAgentSignup(user) : shouldRejectSignup(user)) {
      throw createError({ statusCode: 403, statusMessage: `${isAgent ? "Agent" : "User"} already activated, or invalid type!` });
    }

    // Validate the activation token and its expiration date
    validateActivationToken(user.verification, token as string);

    return successResponse(`${isAgent ? "Agent" : "User"} not activated`);
  } catch (error) {
    throw error;
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
  if (!verification.activationToken) {
    throw createError({ statusCode: 400, statusMessage: "Activation token is missing, try signing up again" });
  }

  if (verification.activationToken !== token) {
    throw createError({ statusCode: 400, statusMessage: "Activation token does not match, try signing up again" });
  }

  if (verification.activationTokenExpiry && new Date(verification.activationTokenExpiry) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
  }
}
