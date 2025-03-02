
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

    // if verification object is not found
    if(!user.verification) throw createError({ statusCode: 404, statusMessage: "Verification status not found" });

    // Throw an error if the user is an agent or already activated
    if (shouldRejectSignup(user)) throw createError({ statusCode: 403, statusMessage: "User already activated, or is agent!" });

    if (user.verification.activationToken !== token) {
      throw createError({ statusCode: 400, statusMessage: "Activation token does not match, try signing up again" });
    }

    if (user.verification.activationTokenExpiry && new Date(user.verification.activationTokenExpiry) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
    }

    return successResponse("User not activated");
  } catch (error) {
    return error;
  }
});