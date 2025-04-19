import { z } from "zod";
import handleOwnerSignup from "../../utils/handle-owner-signup";
import handleAgentSignup from "../../utils/handle-agent-signup";

// Zod schema for validating the request body
// Role is important for signup - it determines the role in the database
const roleSchema = z.object({
  role: z.boolean(),
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

/**
 * Handles signup requests for both owners and agents.
 * Determines the role, processes user validation, and sends activation emails.
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse, successResponse } = useResponse();
  try {
    const requestBody = await readBody(event);
    // parse and validate the role
    const { role } = await roleSchema.parse(requestBody);
    // once we have a valid role we generate a token
    const token = generateToken();

    // generate random 6 digit code
    const otpCode = generateOtpCode();

    /**
     * We only parse the user schema if the role is user
     * Ignoring the agent schema
     */
    if (!role) {
      const { email } = await userSchema.parse(requestBody);
      const user = await handleOwnerSignup(email, token, otpCode);
      return {
        userID: user.id,
        email: user.email,
        token: user.verification?.activationToken,
        otpCode: user.verification?.otpCode,
      };
    } else {
      // we can assume this is agent due to zod validation
      const agentBody = await agentSchema.parse(requestBody);
      await handleAgentSignup(agentBody, token, otpCode);
      return successResponse("Agent signup successful");
    }
  } catch (err) {
    return errorResponse(err, event);
  }
});
