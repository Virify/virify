import * as z from "zod";

// schema for validating the request body
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  turnstileToken: z.string().min(1, 'Bot verification is required'),
});

/**
 * Handles the login request for users.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const { email: rawEmail, password, turnstileToken } = await readValidatedBody(event, loginSchema.parse);
    const email = rawEmail.toLowerCase();

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '';
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isValidToken) throw createError({ statusCode: 403, statusMessage: 'Bot verification failed. Please try again.' });

    const user = await authenticateUser(email, password);
    await loginUser(event, user);

    return {
      user
    }
  } catch (err) {
    return errorResponse(err, event);
  }
});
