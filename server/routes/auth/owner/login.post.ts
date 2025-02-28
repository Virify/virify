/**
 * Handles the login request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { internalServerError } = useResponse();
  // Extract email and password from the request body
  const { email, password } = await readBody(event);
  try {
    // Authenticate the user
    const user = await authenticateUser(email, password, false);
    // Call the login function with the extracted email and password, and specify that this is not an agent login
    return await loginUser(event, user, false);
    // return successResponse("Logged in successfully");
  } catch (error) {
    // Return an internal server error response in case of an exception
    return internalServerError(error as Error);
    // return internalServerError(error as Error);
  }
});
