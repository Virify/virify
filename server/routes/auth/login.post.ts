/**
 * Handles the login request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  // TODO: Incorporate zod validation for the request body
  // get the email, password, and role from the request body
  const { email, password, role } = await readBody(event);

  const { successResponse } = useResponse();

  // detemine which form is being submitted
  // TRUE = USER, false = AGENT
  const userRole = role === "user" ? true : false;
  
  try {
    // Authenticate the user
    const user = await authenticateUser(email, password, userRole);

    // Login the user using nuxt auth session
    await loginUser(event, user, userRole);

    // Return a success response
    return successResponse("Logged in successfully!");
  } catch (err) {
    throw err;
  }
});
