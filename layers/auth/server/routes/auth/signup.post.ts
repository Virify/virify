import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const requestBody = await readBody(event);

    const token = generateToken();
    const otpCode = generateOtpCode();

    const { email } = userSchema.parse(requestBody);
    const user = await handleOwnerSignup(email, token, otpCode);
    return {
      userID: user.id,
      email: user.email,
      token: user.verification?.activationToken,
      otpCode: user.otpCode,
    };
  } catch (err) {
    return errorResponse(err, event);
  }
});
