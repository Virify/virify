/**
 * Validates and trims the email and password fields.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @returns A Promise that resolves to an object containing the trimmed email and password.
 * @throws An error if the email or password is invalid.
 */
export default async function loginFieldValidator(email: string, password: string) {
  // Trim the email and password
  const trimmedPassword = password.trim();
  const trimmedEmail = email.trim();
  // Validate the email format
  const validEmail = validateEmail(trimmedEmail);
  // Check if the email or password is invalid
  if (!validEmail || !trimmedPassword) {
    throw new Error("Email and password are required");
  }
  // Check if the email format is invalid
  if (!validEmail) {
    throw new Error("Invalid email format");
  }
  // Return the trimmed email and password
  return {
    trimmedEmail,
    trimmedPassword,
  };
}