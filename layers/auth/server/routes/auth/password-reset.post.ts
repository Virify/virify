import * as z from "zod";
import { updateOwnerPasswordToken } from "~~/layers/database/server/utils/owner";
import sendPasswordReset from "~~/layers/email/server/email/send-password-reset";
import validatePasswordToken from "../../utils/validate-password-token";

const passwordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { email } = await readValidatedBody(event, passwordSchema.parse);
    const existingUser = await findOwner(email);

    // Check if the user already has a valid password reset token
    if (existingUser && validatePasswordToken(existingUser)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Valid password reset email already sent",
      });
    }

    const passwordToken = await generateToken();
    const otpCode = await generateOtpCode();

    const updatedUser = await updateOwnerPasswordToken(email, passwordToken, otpCode);

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    await sendPasswordReset(email, passwordToken, otpCode);

    return {
      userID: updatedUser.id,
      email: updatedUser.email,
      passwordToken,
      otpCode,
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
