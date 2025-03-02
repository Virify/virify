/**
 * Handles user activation by verifying the token and updating their password.
 */
export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();

  try {
    // Extract request body parameters
    const { password, token, email } = await readBody(event);
    console.log(password, token, email);

    // Validate input
    validateActivationRequest(token, email, password);

    // Find the user by token and email
    const user = await findOwnerByToken(token as string);

    // Ensure the user exists (when get from token)
    if (!user) throw createError({ statusCode: 400, statusMessage: "No Valid token found for user, try signing up again!" });

    // Ensure the user is not an agent or already activated
    if (shouldRejectSignup(user)) throw createError({ statusCode: 403, statusMessage: "User already activated, or is agent!" });

    // Ensure the token is not expired and user is not activated
    validateToken(token, user);

    // Hash the new password securely
    const hashedPassword = await hashPassword(password);

    // Activate user by updating password and clearing activation token
    await activateUser(user.id, hashedPassword);

    // Return success response
    return successResponse("User activated");
  } catch (error) {
    return error;
  }
});

/**
 * Validates activation request parameters.
 * Ensures that the token, email, and password are provided.
 * @throws Error if any required parameter is missing
 */
function validateActivationRequest(token?: string, email?: string, password?: string) {
  if (!token || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });
  }
}
