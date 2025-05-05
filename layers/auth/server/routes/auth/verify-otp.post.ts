import * as z from "zod";
import { verifyActivationOtpCode, verifyPasswordResetOtpCode } from "../../utils/verify-otp-code";

const otpSchema = z.object({
  token: z.string().optional(),
  otpCode: z.array(z.string()).length(6),
  passwordToken: z.string().optional(),
});

/**
 * Handles the OTP verification request for users.
 * Dependng the token provided, it will forward the user appropriately
 * 
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { token, otpCode, passwordToken } = await readValidatedBody(event, otpSchema.parse);
    // activation
    if (token) {
      const user = await verifyActivationOtpCode(event, token, otpCode);
      return {
        message: "User activated successfully",
        user: user,
        redirect: "/account",
      };
    }
    // password reset
    if (passwordToken) {
      const user = await verifyPasswordResetOtpCode(passwordToken, otpCode);
      return {
        message: "Email verified successfully",
        user: user,
        redirect: "/password/reset?passwordToken=" + passwordToken,
      };
    }
  } catch (error) {
    return errorResponse(error, event);
  }
});
