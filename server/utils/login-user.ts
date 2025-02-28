import { H3Event } from "h3";
/**
 * Handles the login process for owners and agents.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agen
 * @returns - set User Session
 */
export async function loginUser(event: H3Event, user: any, isAgentLogin: boolean) {
  // Set the user session
  return await setSession(event, user, isAgentLogin);
}
