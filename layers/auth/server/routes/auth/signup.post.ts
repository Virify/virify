import { z } from "zod";
import handleOwnerSignup from "../../utils/handle-owner-signup";
import handleAgentSignup from "../../utils/handle-agent-signup";

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
  const { errorResponse, successResponse } = useResponse();

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
      await handleAgentSignup(agentFormData, hashedPassword, token, otpCode);
      return successResponse("Agent signup successful");
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
