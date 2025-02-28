import { authenticateUser } from "~~/server/utils/authenticate-user";
import { loginUser } from "~~/server/utils/login-user";

/**
 * Handles the login request for agents.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { internalServerError } = useResponse();
  // Extract email and password from the request body
  const { email, password } = await readBody(event);
  try {
    // Call the login function with the extracted email and password, and specify that this is an agent login
    const authenticataedUser = await authenticateUser(event, email, password, false);
    return await loginUser(event, authenticataedUser, false);
  } catch {
    // Return an internal server error response in case of an exception
    return internalServerError();
  }
});
