import * as z from "zod";

const tokenSchema = z.string().min(1, "Token is required").max(100, "Token is too long");

/**
 * Handles the account activation request.
 * Validates the token, checks if the user exists, and activates the account.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  try {
    const { token } = getQuery(event);
    
    tokenSchema.parse(token);
    const user = await findOwnerByActivationToken(token as string);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });

    validateActivationToken(user, token as string);
    await updateOwnerAndActivate(user.id);
    await loginUser(event, user, user.role);

    return sendRedirect(event, "/account?success=Account%20activated");
  } catch (error) {
    return sendRedirect(event, "/login?error=Invalid%20or%20expired%20token");
  }
});
