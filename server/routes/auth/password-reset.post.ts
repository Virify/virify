import { Owner } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    // use the useResponse function to handle responses
    const { successResponse } = useResponse();

    // get params from request
    const { password, token } = await readBody(event);
    console.log("Password reset token: ", token);

    // we need to get the user with the token
    const tokenUser = await findOwnerByPasswordToken(token);

    verifyToken(tokenUser);

    // hash the password
    const hashedPassword = await hashPassword(password);

    // update the password in the database and set token to null
    await updateOwnerByToken(token, hashedPassword);

    return successResponse("Password updated successfully");
  } catch (error) {
    throw error;
  }
});

/**
 * Validates the owner and token 
 * @param owner Owner
 * @throws {Error} If the token is invalid or expired
 */
function verifyToken(owner: Owner | null) {
  // check if the token OR user exists
  if (!owner) throw createError({ statusCode: 400, statusMessage: "Invalid token or user" });

  // check the token expiration
  if (owner.passwordResetToken && new Date(owner.passwordResetToken) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
  }
}
