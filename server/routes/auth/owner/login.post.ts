/**
 * Handles the login request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();

  // Extract email and password from the request body
  const { email, password } = await readBody(event);

  try {
    // Authenticate the user
    const user = await authenticateUser(email, password, false);

    // Call the login function with the extracted email and password, and specify that this is not an agent login
    await loginUser(event, user, false);

    // Return a success response
    return successResponse("Logged in successfully");
  } catch (err) {
    return err;
  }
});
