import { OwnerRole } from "@prisma/client";
import { H3Event } from "h3";

/**
 * Handles the successful OAuth login.
 * @param event - The H3 event object.
 * @param user - The user object returned from the OAuth provider.
 * @returns A Promise that resolves to a redirect response.
 */
export async function handleOAuthSuccess(event: H3Event, email: string) {
  try {
    // Check if the user already exists in the database
    const dbUser = await handleOAuthDatabase(email);

    // Check if the user is an agent
    if (dbUser.role === OwnerRole.AGENT) {
      // Throw an error if the user is an agent
      throw new Error("Error: Agent login not allowed");
    }

    // Set the session and redirect to the login page
    await setSession(event, dbUser, false);

    // Redirect to the login page with a success message
    return sendRedirect(event, "/login?login=success");
  } catch (error) {
    // Redirect to the login page with an error message
    return sendRedirect(event, `/login?error=agent`);
  }
}

/**
 * Handles OAuth login errors.
 * @param event - The H3 event object.
 * @param error - The error object.
 * @returns A redirect response with the error message.
 */
export function handleOAuthError(event: H3Event, error: any) {
  // Redirect to the login page with the error message
  return sendRedirect(event, `/login?error=${error.message}`);
}

/**
 * Checks if the user already exists in the database or creates a new OAuth owner.
 * @param email - The email of the user attempting to log in.
 * @returns A Promise that resolves to the user object.
 */
export async function handleOAuthDatabase(email: string) {
  // Check if the user already exists in the database
  let user = await findOwner(email);

  // If the user does not exist, create a new OAuth owner
  if (!user) {
    user = await createOauthOwner(email);
  }

  // Return the user object
  return user;
}
