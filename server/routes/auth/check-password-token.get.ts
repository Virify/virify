import { Owner } from "@prisma/client";

/**
 * Endpoint to check if the password reset token is valid.
 * 
 * @param event - The H3 event object.
 * @returns A standardized HTTP response indicating whether the token is valid or not.
 */
export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();
  
  // get the token from the query
  const { token } = getQuery(event);

  try {
    // get the user with the token
    const tokenUser = await findOwnerByPasswordToken(token as string);

    validateToken(tokenUser);

    return successResponse("Token is valid");
  } catch (error) {
    throw error
  }
});

/**
 * Validate the token and check if it is expired
 * 
 * @param user Owner
 */
function validateToken(user: Owner | null): void {
// check if the token is valid
if (!user) throw createError({ statusCode: 400, statusMessage: "Invalid token or User!" });

// check token expiration
if (user.passwordResetToken && new Date(user.passwordResetToken) < new Date()) {
  throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
}
}