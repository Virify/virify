import { OwnerRole } from "@prisma/client";

/**
 * Authenticates the user by validating email and password.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agent.
 * @returns A standardized HTTP response.
 */
export async function authenticateUser(email: string, password: string, isAgentLogin: boolean) {
  const { unauthorizedResponse, forbiddenResponse, internalServerError } = useResponse();

  try {
    // Validate and trim the email and password
    const { trimmedEmail, trimmedPassword } = await loginFieldValidator(email, password);

    // Find the user based on the login type (agent or owner)
    const user = isAgentLogin ? await findAgent(trimmedEmail) : await findOwner(trimmedEmail);

    // If user is not found, return an unauthorized response
    if (!user) return unauthorizedResponse("User not found");

    // If the login is not for an agent and the user is an agent, return a forbidden response
    if (!isAgentLogin && user.role === OwnerRole.AGENT) {
      return forbiddenResponse("User is an agent, please login as an agent");
    }

    // Verify the password
    const passwordVerified = await verifyPassword(user.password as string, trimmedPassword);
    if (!passwordVerified) return unauthorizedResponse("Password is incorrect");

    // Return the authenticated user
    return user;
  } catch {
    // Return an internal server error response in case of an exception
    return internalServerError();
  }
}
