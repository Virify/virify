import { findOwnerByToken, activateUser } from "~~/server/utils/owner";

/**
 * Handles user activation by verifying the token and updating their password.
 */
export default defineEventHandler(async (event) => {
  const { internalServerError, successResponse } = useResponse();

  try {
    // Extract request body parameters
    const { password, token, email } = await readBody(event);

    // Validate input
    validateActivationRequest(token, email, password);

    // Find the user by token and email
    const user = await findOwnerByToken(token as string);

    // Handle cases where the token is expired
    handleExpiredToken(user);

    // Ensure the user exists (when get from token)
    if (!user) throw new Error("Failed! Token Invalid");

    // Hash the new password securely
    const hashedPassword = await hashPassword(password);

    // Activate user by updating password and clearing activation token
    await activateUser(user.id, hashedPassword);
    
    // Return success response
    return successResponse("User activated");
  } catch (error) {
    console.log(error);
    return internalServerError(error as Error);
  }
});

/**
 * Validates activation request parameters.
 * Ensures that the token, email, and password are provided.
 * @throws Error if any required parameter is missing
 */
function validateActivationRequest(token?: string, email?: string, password?: string) {
  if (!token || !email || !password) {
    throw new Error("Token, email, and password are required");
  }
}

/**
 * Checks if the activation token has expired.
 * If expired, instructs the user to request a new activation email.
 * @throws Error if the token is expired
 */
function handleExpiredToken(user: any) {
  if (user?.tokenExpiry && new Date(user.tokenExpiry) < new Date()) {
    throw new Error("Failed! Token expired. Please request a new activation email.");
  }
}
