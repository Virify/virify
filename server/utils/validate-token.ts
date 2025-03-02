/**
 * Check if the user token is valid and indate.
 * @param token string
 * @param user User
 * @returns Boolean | Error
 */
export default function validateToken(token: string, user: any): void {
  if (user.verification.activationToken !== token) {
    throw createError({ statusCode: 400, statusMessage: "Activation token does not match, try signing up again" });
  }

  if (new Date(user.verification.activationTokenExpiry) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: "Activation token expired, try signing up again" });
  }
}
