/**
 * Validates an existing agent.
 * Throws an error if the agent is a user, under review, rejected, or registered at the same address.
 * @param agent - The existing agent (if any).
 * @param address - The address to check for duplicates.
 */
export default function validateExistingAgent(agent: OwnerWithVerification, address: string): OwnerWithVerification {

  if (agent.role === OwnerRole.USER) {
    throw createError({ statusCode: 400, statusMessage: "User already exists with that email!" });
  }

  const reviewedStatus = agent.verification?.reviewed;

  if (reviewedStatus === Reviewed.PENDING) {
    throw createError({ statusCode: 400, statusMessage: "Agent already exists and is pending review" });
  }

  if (reviewedStatus === Reviewed.REJECTED) {
    throw createError({ statusCode: 400, statusMessage: "Agent was rejected. Contact support for more information" });
  }

  if (agent.addressLine1 === address) {
    throw createError({ statusCode: 400, statusMessage: "Agent already registered at that address!" });
  }

  return agent;
}