import sendActivation from "~~/layers/email/server/email/send-owner-activation";
import sendAgentReview from "~~/layers/email/server/email/send-agent-review";
import sendToAgentReview from "~~/layers/email/server/email/send-to-agent-review";
import { Reviewed, OwnerRole } from "@prisma/client";
import { z } from "zod";

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

type AgentFormData = z.infer<typeof agentSchema>;

/**
 * Handles signup requests for both owners and agents.
 * Determines the role, processes user validation, and sends activation emails.
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  // TODO: This whole file is a mess, we need to refactor it
  const { successResponse, errorResponse } = useResponse();
  try {
    const requestBody = await readBody(event);

    // parse and validate the role
    const { role } = await roleSchema.parse(requestBody);
    // once we have a valid role we generate a token
    const token = generateToken();

    /**
     * We only parse the user schema if the role is user
     * Ignoring the agent schema
     */
    if (!role) {
      const { email } = await userSchema.parse(requestBody);
      await handleOwnerSignup(email, token);
    } else {
      // we can assume this is agent due to zod validation
      const agentBody = await agentSchema.parse(requestBody);
      await handleAgentSignup(agentBody, token);
    }

    // Return a success message with dynamic role name
    return successResponse("Successfully signed up!");
  } catch (err) {
    console.log(err);
    return errorResponse(err, event);
  }
});

/**
 * Handles the signup process for an owner.
 * Validates existing users, updates tokens when needed, and sends activation emails.
 * @param email - The owner's email address.
 * @param token - The generated activation token.
 */
async function handleOwnerSignup(email: string, token: string) {
  try {
    const existingUser = await findOwnerWithVerification(email);

    if (existingUser) {
      // If user exists, check if signup should be rejected
      if (shouldRejectSignup(existingUser)) {
        throw createError({ statusCode: 403, statusMessage: "User already activated" });
      }

      // If an activation email was already sent and is still valid, prevent resending
      if (existingUser.verification?.activationToken && existingUser.verification.activationTokenExpiry! > new Date()) {
        throw createError({ statusCode: 400, statusMessage: "Activation email already sent! Please check your inbox" });
      }

      // if the token has expired, we can send a new one
      if(existingUser.verification?.activationToken && existingUser.verification.activationTokenExpiry! < new Date()) {
        await sendActivation(email, token);
        await updateOwnerToken(email, token);
      }
    } else {
      await sendActivation(email, token);
      await createOwnerWithToken(email, token);
    }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "Error creating User", data: "Error creating User" });
  }
}

/**
 * Handles the signup process for an agent.
 * Checks for existing agents, creates new records, and sends review notifications.
 * @param formData - The agent's submitted data.
 * @param token - The generated activation token.
 */
async function handleAgentSignup(formData: AgentFormData, token: string) {
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = formData;
  try {
    // Check if an agent already exists with the same email or address
    const agent = await findBusinessOwner(email, addressLine);

    // Handle existing agent
    handleExistingAgent(agent, addressLine);

    // send review emails
    await sendToAgentReview(formData);
    await sendAgentReview(formData, token);

    // If agent does not exist, create a new record with the token
    await createBusinessOwnerWithToken(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber, token);

    // Send an email to the agent informing them of the review process
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: "Error creating Agent", data: "Error creating Agent" });
  }
}

/**
 * Handles cases where an agent already exists. OR is rejectedf
 * Throws an error if the agent is pending, rejected, or already registered at the same address.
 * @param agent - The existing agent object (if found).
 * @param address - The submitted address to check against.
 * @throws An error if an agent is already registered with the given details.
 */
function handleExistingAgent(agent: BusinessOwnerWithVerification | null, address: string): void {
  if (agent) {
    // Check is the agent is a user
    if (agent.role === OwnerRole.USER) {
      throw createError({ statusCode: 400, statusMessage: "User already exists with that email!" });
    }

    // Check if the agent is still under review
    if (agent.verification?.reviewed === Reviewed.PENDING) {
      throw createError({ statusCode: 400, statusMessage: "Agent already exists and is pending review" });
    }

    // Check if the agent was previously rejected
    if (agent.verification?.reviewed === Reviewed.REJECTED) {
      throw createError({ statusCode: 400, statusMessage: "Agent was rejected. Contact support for more information" });
    }

    // Check if the agent is already registered at the same address
    if (agent.addressLine1 === address) {
      throw createError({ statusCode: 400, statusMessage: "Agent already registered at that address!" });
    }

    // Default case: agent exists but doesn't match other conditions
    throw createError({ statusCode: 400, statusMessage: "Agent already exists" });
  }
}
