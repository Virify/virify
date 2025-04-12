import { z } from "zod";

// schema for validating the request body
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Handles the login request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { successResponse, errorResponse } = useResponse();

  try {
    // Parse and validate the request body
    const { email, password } = await readValidatedBody(event, loginSchema.parse);

    // detemine which form is being submitted

    // Authenticate the user
    const user = await authenticateUser(email, password);

    // Login the user using nuxt auth session and set their role
    await loginUser(event, user, user.role);

    // Return a success response
    return successResponse("Logged in successfully!");
  } catch (err) {
    return errorResponse(err, event);
  }
});
