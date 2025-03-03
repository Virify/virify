import { OwnerRole } from "@prisma/client";

/**
 * Authenticates the user by validating email and password.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agent.
 * @returns A User.
 */
export async function authenticateUser(email: string, password: string, isUserLogin: boolean) {

  // Validate and trim the email and password
  const { trimmedEmail, trimmedPassword } = await loginFieldValidator(email, password);

  // Find the user based on the login type (agent or owner)
  const user = await findOwner(trimmedEmail);

  // If user is not found, return an unauthorized response
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "User not found" });
  }

  // If the login is not for an agent and the user is an agent, return a forbidden response
  if (isUserLogin && user.role === OwnerRole.AGENT) {
    throw createError({ statusCode: 403, statusMessage: "Agent login not allowed" });
  }

  // If the login is for an agent and the user is not an agent, return a forbidden response
  if (!isUserLogin && user.role === OwnerRole.USER) {
    throw createError({ statusCode: 403, statusMessage: "User login not allowed" });
  }

  // Verify the password
  const passwordVerified = await verifyPassword(user.password as string, trimmedPassword);

  if (!passwordVerified) throw createError({ statusCode: 401, statusMessage: "Password incorrect", message: "Password does not match" });

  // Return the authenticated user
  return user;
}
