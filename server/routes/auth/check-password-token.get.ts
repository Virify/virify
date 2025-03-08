import { navigateTo } from "nuxt/app";

export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();
  // get the token from the url
  const { token } = getQuery(event);

  try {
    // get the user with the token
    const tokenUser = await findOwnerByPasswordToken(token as string);

    // check if the token is valid
    if (!tokenUser) throw createError({ statusCode: 400, statusMessage: "Invalid token or User!" });

    // check token expiration
    if (tokenUser.passwordResetToken && new Date(tokenUser.passwordResetToken) < new Date()) {
      throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
    }

    return successResponse("Token is valid");
  } catch (error) {
    throw error
  }
});
