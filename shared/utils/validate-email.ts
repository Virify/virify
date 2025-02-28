/**
 * Validates the email format.
 * @param email - The email to validate.
 * @returns A boolean indicating whether the email format is valid.
 */
export default function validateEmail(email: string): boolean {
  // Regular expression for validating email format
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Test the email against the regular expression
  return re.test(email);
}