import * as z from "zod";
import sendPasswordReset from "~~/layers/email/server/email/send-password-reset";
import validatePasswordToken from "../../utils/validate-password-token";

const passwordSchema = z.object({
  email: z.string().email("Invalid email address"),
  turnstileToken: z.string().min(1, 'Bot verification is required'),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { email, turnstileToken } = await readValidatedBody(event, passwordSchema.parse);

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '';
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isValidToken) throw createError({ statusCode: 403, statusMessage: 'Bot verification failed. Please try again.' });
    const existingUser = await findUser(email);

    if(!existingUser) throw createError({ statusCode: 404, statusMessage: "User not found" });

    // Check if the user already has a valid password reset token
    if (existingUser && validatePasswordToken(existingUser)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Valid password reset email already sent",
      });
    }

    const passwordToken = generateToken();
    const otpCode = generateOtpCode();

    const updatedUser = await updateUserPasswordToken(email, passwordToken, otpCode);

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    await sendPasswordReset(email, passwordToken, otpCode);

    return {
      userID: updatedUser.id,
      email: updatedUser.email,
      passwordToken,
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
