import * as z from "zod";

const activateSchema = z.object({
  token: z.string(),
});

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
  const { successResponse, errorResponse } = useResponse();

  try {
    const query = getQuery(event);
    const { token } = activateSchema.parse(query);

    // get the user by activation token
    const user = await findOwnerByActivationToken(token);
    // Validate the user and their verification status
    if (!user?.verification) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    // if user is agent and tries to activate on user account reject and vice versa
    if (shouldRejectSignup(user)) {
      throw createError({ statusCode: 403, statusMessage: "User already activated" });
    }

    // Validate the activation token and its expiration date
    validateActivationToken(user.verification, token);
    return successResponse("User is not activated");
  } catch (error) {
    return errorResponse(error, event);
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
