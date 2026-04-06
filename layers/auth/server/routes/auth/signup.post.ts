import { z } from "zod";
import handleUserSignup from "../../utils/handle-user-signup";

const userSchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().min(1, 'Bot verification is required'),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const requestBody = await readBody(event);
    const { email, turnstileToken } = userSchema.parse(requestBody);

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || '';
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!isValidToken) throw createError({ statusCode: 403, statusMessage: 'Bot verification failed. Please try again.' });

    const token = generateToken();
    const otpCode = generateOtpCode();
    const user = await handleUserSignup(email, token, otpCode);
    return {
      userID: user.id,
      email: user.email,
      token: user.verification?.activationToken,
    };
  } catch (err) {
    return errorResponse(err, event);
  }
});
