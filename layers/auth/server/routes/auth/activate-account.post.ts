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
    // validate the request body
    const { password, token } = await readValidatedBody(event, activateSchema.parse);

    // Find the user by the activation token
    // The token has already been verified by check-not-activated
    const user = await findOwnerByActivationToken(token);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid Token." });

    // Hash the new password securely
    const hashedPassword = await hashPassword(password);

    // Activate user by updating password and clearing activation token
    await updateOwnerAndActivate(user.id, hashedPassword);

    // Return success response
    return successResponse("Successfully activated account.");
  } catch (error) {
    return errorResponse(error, event);
  }
});
