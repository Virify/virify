/**
 * Handles user activation by verifying the token and updating their password.
 */
export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();

  try {
    // Extract request body parameters
    const { password, token, email } = await readBody(event);

    // Validate input
    validateActivationRequest(token, email, password);

    // Hash the new password securely
    const hashedPassword = await hashPassword(password);

    // Find the user by email
    const user = await findOwnerWithVerification(email);

    if (!user) throw createError({ statusCode: 404, statusMessage: "User not found." });

    // Activate user by updating password and clearing activation token
    await updateOwnerAndActivate(user.id, hashedPassword);

    // Return success response
    return successResponse("Successfully activated account.");
  } catch (error) {
    throw error;
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

  if(!validatePassword(password)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid password" });
  }
}
