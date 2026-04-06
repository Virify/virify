export default function validatePasswordToken(user: User): boolean {
  const now = new Date();
  if (!user.passwordResetToken) {
    return false;
  }
  if (user.passwordResetTokenExpiry && user.passwordResetTokenExpiry < now) {
    return false;
  }
  return true;
}