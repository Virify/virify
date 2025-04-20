import sendActivation from "#layers/email/server/email/send-owner-activation";
/**
 * Handles the case where an existing user is found.
 * Validates user state and conditionally resends activation tokens.
 * @param user - The existing user record.
 * @param token - The new activation token.
 * @param otpCode - The new OTP code.
 */
export default async function handleExistingUser(user: OwnerWithVerification, token: string, otpCode: string): Promise<OwnerWithVerification> {
  try {
    const now = new Date();

    if (shouldRejectSignup(user)) {
      throw createError({ statusCode: 403, statusMessage: "User already activated" });
    }

    const hasValidToken = user.verification?.activationToken && user.verification.activationTokenExpiry! > now;
    const hasValidOtp = user.verification?.otpCodeExpiry && user.verification.otpCodeExpiry > now;

    if (hasValidToken && hasValidOtp) {
      throw createError({ statusCode: 400, statusMessage: "Activation email already sent! Please check your inbox" });
    }

    // Resend activation if either token or OTP is expired
    await sendActivation(user.email, token, otpCode);
    await updateOwnerTokens(user.email, token, otpCode);

    return user;
  } catch (error) {
    throw error;
  }
}
