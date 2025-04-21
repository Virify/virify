import sendAgentReview from "#layers/email/server/email/send-agent-review";
import sendToAgentReview from "#layers/email/server/email/send-to-agent-review";
import type { AgentFormData } from "#layers/auth/server/routes/auth/signup.post";
import { findBusinessOwner, createBusinessOwnerWithToken, type OwnerWithVerification } from "#layers/database/server/utils/owner";

/**
 * Handles the signup process for an agent.
 * Checks for existing agents, creates new records, and sends review notifications.
 * @param formData - The agent's submitted data.
 * @param token - The generated activation token.
 */
export default async function handleAgentSignup(formData: AgentFormData, token: string, otpCode: string): Promise<OwnerWithVerification> {
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = formData;

  try {
    const existingAgent = await findBusinessOwner(email, addressLine);
    
    if(existingAgent) {
      return validateExistingAgent(existingAgent, addressLine);
    }

    await Promise.all([sendToAgentReview(formData), sendAgentReview(formData, token)]);
    const agent = await createBusinessOwnerWithToken(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber, token);

    return agent;
  } catch (error) {
    throw error;
  }
}