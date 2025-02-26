export default async function loginFieldValidator(email: string, password: string): Promise<{ trimmedEmail: string; trimmedPassword: string }> {
  const trimmedPassword = password.trim();
  const trimmedEmail = email.trim();

  const validEmail = validateEmail(trimmedEmail);

  if (!validEmail || !trimmedPassword) {
    throw new Error("Email and password are required");
  }

  if (!validEmail) {
    throw new Error("Invalid email format");
  }

  return {
    trimmedEmail,
    trimmedPassword,
  };
}
