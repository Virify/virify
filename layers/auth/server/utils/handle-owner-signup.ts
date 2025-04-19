import { createOwnerWithTokens, updateOwnerTokens, type OwnerWithVerification } from "~~/layers/database/server/utils/owner";
import sendActivation from "~~/layers/email/server/email/send-owner-activation";

/**
 * Handles the signup process for an owner.
 * Validates existing users, updates tokens when needed, and sends activation emails.
 * @param email - The owner's email address.
 * @param token - The generated activation token.
 */
export default async function handleOwnerSignup(email: string, token: string, otpCode: string) {
  try {
    const existingUser = await findOwnerWithVerification(email);

    if (existingUser) {
      const validatedUser = handleExistingUser(existingUser, token, otpCode);
      return validatedUser;
    }

    await sendActivation(email, token, otpCode);
    const user = await createOwnerWithTokens(email, token, otpCode);
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Handles the case where an existing user is found.
 * 
 * @param user OwnerWithVerification
 * @param token string
 * @param otpCode string
 * @returns OwnerWithVerification
 */
async function handleExistingUser(user: OwnerWithVerification, token: string, otpCode: string): Promise<OwnerWithVerification> {
  // If user exists, check if signup should be rejected
  if (shouldRejectSignup(user)) {
    throw createError({ statusCode: 403, statusMessage: "User already activated" });
  }

  // If an activation email was already sent and is still valid, prevent resending
  if (user.verification?.activationToken && user.verification.activationTokenExpiry! > new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Activation email already sent! Please check your inbox" });
  }

  if (!user.verification?.otpCodeExpiry || user.verification.otpCodeExpiry! < new Date()) {
    // if the OTP code has expired, we can send a new one
    await sendActivation(user.email, token, otpCode);
    await updateOwnerTokens(user.email, token, otpCode);
    return user;
  }

  // if the token has expired, we can send a new one
  if (user.verification?.activationToken && user.verification.activationTokenExpiry! < new Date()) {
    await sendActivation(user.email, token, otpCode);
    await updateOwnerTokens(user.email, token, otpCode);
    return user;
  }

  return user;
}
