import { OwnerRole } from "@prisma/client";

/**
 * Authenticates the user by validating email and password.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agent.
 * @returns A User.
 */
export async function authenticateUser(email: string, password: string) {

  // Find the user based on the login type (agent or owner)
  const user = await findOwner(email);

  // If user is not found, return an unauthorized response
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Sorry, User not found." });
  }

  // Verify the password
  const passwordVerified = await verifyPassword(user.password as string, password);

  if (!passwordVerified) throw createError({ statusCode: 401, statusMessage: "Password incorrect", message: "Password does not match" });

  // Return the authenticated user
  return user;
}
