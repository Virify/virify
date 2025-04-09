import { z } from "zod";

// schema for validating the request body
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["user", "agent"]),
});

/**
 * Handles the login request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  const { email, password, role } = await loginSchema.parse(requestBody);

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
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: err.errors, // Send structured error messages
      });
    }
    throw err;
  }
});
