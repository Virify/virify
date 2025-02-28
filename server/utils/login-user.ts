import { H3Event } from "h3";

/**
 * Handles the login process for owners and agents.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agent.
 * @returns A standardized HTTP response.
 */
export async function loginUser(event: H3Event, user: any, isAgentLogin: boolean) {
  const { successResponse, internalServerError } = useResponse();

  try {
    // Set the user session
    await setSession(event, user, isAgentLogin);

    // Return a success response
    return successResponse("Logged in successfully");
  } catch {
    // Return an internal server error response in case of an exception
    return internalServerError();
  }
}
