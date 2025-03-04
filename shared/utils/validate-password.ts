/**
 * Validate password
 *
 * - Check if password is at least 8 characters long
 * - Check if password contains at least one uppercase letter
 * - Check if password contains at least one lowercase letter
 * - Check if password contains at least one number
 *
 * @param password string
 * @returns Boolean
 */
export default function validatePassword(password: string) {
  const pattern = new RegExp("^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$");
  return !pattern.test(password);
}
