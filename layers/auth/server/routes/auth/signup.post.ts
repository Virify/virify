import { z } from "zod";

const roleSchema = z.object({
  role: z.boolean(), // false = Owner, true = Agent
});

const passwordSchema = z.object({
  password: z.string().min(8),
});

const userSchema = z.object({
  email: z.string().email(),
});

const agentSchema = z.object({
  email: z.string().email(),
  businessName: z.string(),
  mainContact: z.string(),
  addressLine: z.string(),
  city: z.string(),
  county: z.string(),
  country: z.string(),
  postcode: z.string(),
  registrationNumber: z.string(),
});

export type AgentFormData = z.infer<typeof agentSchema>;

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const requestBody = await readBody(event);
    const { role } = roleSchema.parse(requestBody);
    const { password } = passwordSchema.parse(requestBody);

    const hashedPassword = await hashPassword(password);
    const token = generateToken();
    const otpCode = generateOtpCode();

    // if Agent
    if (role) {
      const agentFormData = agentSchema.parse(requestBody);
      const agent = await handleAgentSignup(agentFormData, hashedPassword, token, otpCode);
      return {
        userID: agent.id,
        email: agent.email,
        token: agent.verification?.activationToken,
        otpCode: agent.verification?.otpCode,
      }
    }

    const { email } = userSchema.parse(requestBody);
    const user = await handleOwnerSignup(email, hashedPassword, token, otpCode);
    return {
      userID: user.id,
      email: user.email,
      token: user.verification?.activationToken,
      otpCode: user.verification?.otpCode,
    };
  } catch (err) {
    return errorResponse(err, event);
  }
});
