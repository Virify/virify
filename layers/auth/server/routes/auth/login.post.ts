import * as z from "zod";

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
  const { errorResponse } = useResponse();

  try {
    const { email, password } = await readValidatedBody(event, loginSchema.parse);
    const user = await authenticateUser(email, password);
    await loginUser(event, user, user.role);

    return {
      user
    }
  } catch (err) {
    return errorResponse(err, event);
  }
});
