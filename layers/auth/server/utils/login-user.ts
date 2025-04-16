import type { UserSession } from "#auth-utils";
import { H3Event } from "h3";

/**
 * Sets the user session.
 * @param event - The H3 event object.
 * @param user - The user object.
 * @param isAgent - A boolean indicating if the user is an agent.
 * @returns A Promise that resolves when the session is set.
 */
export default async function loginUser(event: H3Event, user: Owner, role: string): Promise<UserSession> {
  try {
    // Clear any existing session
    await clearUserSession(event);
    // Set the new session with user details
    return await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        username: user.username ?? user.email ?? user.firstName,
        role: role,
      },
      loggedIn: true,
      loggedInAt: new Date(),
    });
  } catch (error) {
    // using createError here as setUserSession and clearUserSession are third party
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to set user session",
      data: error,
    });
  }
}
