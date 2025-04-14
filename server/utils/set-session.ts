import { UserSession } from "#auth-utils";
import { H3Event } from "h3";

/**
 * Sets the user session.
 * @param event - The H3 event object.
 * @param user - The user object.
 * @param isAgent - A boolean indicating if the user is an agent.
 * @returns A Promise that resolves when the session is set.
 */
export default async function setSession(event: H3Event, user: Owner, role: string): Promise<UserSession> {
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
}
