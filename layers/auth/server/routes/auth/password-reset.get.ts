/**
 * Password reset token validation
 * @param event H3Event
 * @returns Object
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { passwordToken } = getQuery(event);

    if (!passwordToken) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password token is required.",
      });
    }

    const user = await findUserByPasswordToken(passwordToken as string);

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "Invalid token." });
    }

    sendRedirect(event, "/?showResetPassword=true&passwordToken=" + passwordToken);
  } catch (error) {
    return errorResponse(error, event);
  }
});
