import * as z from "zod";

const activateSchema = z.object({
  password: z.string().min(8),
  token: z.string(),
});

/**
 * Handles user activation by verifying the token and updating their password.
 */
export default defineEventHandler(async (event) => {
  const { successResponse, errorResponse } = useResponse();
  try {
    const { password, token } = await readValidatedBody(event, activateSchema.parse);

    // Validate input
    validateActivationRequest(token, password);

    // Hash the new password securely
    const hashedPassword = await hashPassword(password);

    // Find the user by email
    const user = await findOwnerByActivationToken(token);

    if (!user) throw createError({ statusCode: 404, statusMessage: "User not found." });

    // Activate user by updating password and clearing activation token
    await updateOwnerAndActivate(user.id, hashedPassword);

    // Return success response
    return successResponse("Successfully activated account.");
  } catch (error) {
    return errorResponse(error, event);
  }
});

/**
 * Validates activation request parameters.
 * Ensures that the token, email, and password are provided.
 * @throws Error if any required parameter is missing
 */
function validateActivationRequest(token?: string, password?: string) {
  if (!token || !password) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request" });
  }

  if (!validatePassword(password)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid password" });
  }
}
