import * as z from "zod";
import { verifyOtpCode } from "../../utils/verify-otp-code";

const otpSchema = z.object({
  token: z.string(),
  otp: z.string().length(6, "OTP must be 6 digits"), // assuming 6-digit OTP
});

/**
 * Verifies the OTP code for a given token during activation.
 * This allows users to activate using an OTP instead of clicking the email link.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { token, otp } = await readValidatedBody(event, otpSchema.parse);
    const user = await findOwnerByActivationToken(token);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });
    
    const isValid = await verifyOtpCode(user, otp);

    if (!isValid) {
      throw createError({ statusCode: 400, statusMessage: "Invalid OTP code." });
    }

    return {
      user
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
