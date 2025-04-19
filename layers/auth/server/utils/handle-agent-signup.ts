import sendAgentReview from "~~/layers/email/server/email/send-agent-review";
import sendToAgentReview from "~~/layers/email/server/email/send-to-agent-review";
import type { AgentFormData } from "~~/layers/auth/server/routes/auth/signup.post";
/**
 * Handles the signup process for an agent.
 * Checks for existing agents, creates new records, and sends review notifications.
 * @param formData - The agent's submitted data.
 * @param token - The generated activation token.
 */
export default async function handleAgentSignup(formData: AgentFormData, token: string, otpCode: string) {
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
function handleExistingAgent(agent: OwnerWithVerification | null, address: string): void {
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