import type { UserSession } from "#auth-utils";
import { H3Event } from "h3";
import type { UserWithMembership } from "~~/layers/database/server/utils/user";

/**
 * Handles the login process for users and agents.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agen
 * @returns - set User Session
 */
export async function loginUser(event: H3Event, user: UserWithMembership): Promise<UserSession> {
  // Clear any existing session
  await clearUserSession(event);
  // Set the new session with user details
  return await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username ?? user.email ?? user.firstName,
      membership: user.membership?.type,
      membershipActive: user.membership?.status,
      membershipEndDate: user.membership?.endDate,
    },
    loggedIn: true,
    loggedInAt: new Date(),
  });
}