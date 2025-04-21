import validatePasswordToken from "../../utils/validate-password-token";

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { passwordToken } = getQuery(event);
    const user = await findOwnerByPasswordToken(passwordToken as string);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });
    
    sendRedirect(event, "/password/reset?passwordToken=" + passwordToken);
    
  }
  catch (error) {
    return errorResponse(error, event);
  }
});