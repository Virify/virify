export async function verifyOtpCode(user: OwnerWithVerification, code: string): Promise<boolean> {
  const now = new Date();

  if (!user.verification?.otpCode || user.verification.otpCode !== code) {
    return false;
  }

  if (user.verification?.otpCodeExpiry && user.verification.otpCodeExpiry < now) {
    return false;
  }

  if (!user.verification?.activationToken || !user.verification.activationTokenExpiry || user.verification.activationTokenExpiry < now) {
    return false;
  }

  return true;
}