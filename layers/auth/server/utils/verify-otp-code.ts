import { H3Event } from "h3";

/**
 * Verifies the OTP code for a given token during activation.
 *
 * @param event H3Event
 * @param token string
 * @param otpCode string
 * @returns OwnerWithVerification
 */
export async function verifyActivationOtpCode(event: H3Event, token: string, otpCode: string) {
  const user = await findOwnerByActivationToken(token);

  if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });

  const isValid = await verifyOtpCode(user, otpCode);

  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: "Invalid OTP code." });
  }

  await loginUser(event, user, user.role);
  return await updateOwnerAndActivate(user.id);
}

/**
 * This function verifies the OTP code for a password reset token.
 * 
 * @param passwordToken string
 * @param otpCode string
 * @returns OwnerWithVerification
 */
export async function verifyPasswordResetOtpCode(passwordToken: string, otpCode: string) {
  const user = await findOwnerByPasswordToken(passwordToken);
  if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });

  const isValid = await verifyOtpCode(user, otpCode);

  if (!isValid) {
    throw createError({ statusCode: 400, statusMessage: "Invalid OTP code." });
  }

  return user;
}

/**
 * Valiadates the OTP code for a given user.
 * 
 * @param user OwnerWithVerification
 * @param code string
 * @description Verifies the OTP code for a given user.
 * @returns Boolean
 */
export async function verifyOtpCode(user: OwnerWithVerification, code: string): Promise<boolean> {
  const now = new Date();

  if (!user.otpCode || user.otpCode !== code) {
    return false;
  }

  if (user.otpCodeExpiry && user.otpCodeExpiry < now) {
    return false;
  }

  return true;
}