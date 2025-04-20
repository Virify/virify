import * as z from "zod";
import { verifyOtpCode } from "../../utils/verify-otp-code";

const otpSchema = z.object({
  token: z.string(),
  otpCode: z.string().length(6, "OTP must be 6 digits"),
});

/**
 * Verifies the OTP code for a given token during activation.
 * This allows users to activate using an OTP instead of clicking the email link.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { token, otpCode } = await readValidatedBody(event, otpSchema.parse);
    const user = await findOwnerByActivationToken(token);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });
    
    const isValid = await verifyOtpCode(user, otpCode);

    if (!isValid) {
      throw createError({ statusCode: 400, statusMessage: "Invalid OTP code." });
    }
    
    await loginUser(event, user, user.role);
    await updateOwnerAndActivate(user.id);
  

    return {
      message: "User activated successfully",
      user: user,
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
