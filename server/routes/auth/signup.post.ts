import sendActivation from "~~/server/email/send-owner-activation";
import sendAgentReview from "~~/server/email/send-agent-review";
import sendToAgentReview from "~~/server/email/send-to-agent-review";
import { Reviewed, OwnerRole } from "@prisma/client";
import agent from "~~/server/api/agent/agent";

/**
 * Handles signup requests for both owners and agents.
 * Determines the role, processes user validation, and sends activation emails.
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  // Read request body
  const { signup, role } = await readBody(event);
  const { successResponse } = useResponse();
  
  let userInfo;
  let agentInfo;

  switch (role) {
    case "agent":
      agentInfo = { ...signup.personal, ...signup.company, ...signup.address };
      console.log(agentInfo);
      break;
    case "user":
      userInfo = signup.email;
      break;
    default:
      throw createError({ statusCode: 400, statusMessage: "Invalid role specified" });
  }

  // generate token
  const token = generateToken();

  try {
    // check if role is user or agent
    if (role === "user") {
      await handleOwnerSignup(userInfo, token);
    } else if (role === "agent") {
      await handleAgentSignup(agentInfo, token);
    } else {
      throw createError({ statusCode: 400, statusMessage: "Invalid role specified" });
    }

    // Return a success message with dynamic role name
    return successResponse(`${role.charAt(0).toUpperCase() + role.slice(1)} signup successful`);
  } catch (err) {
    throw err;
  }
});

/**
 * Handles the signup process for an owner.
 * Validates existing users, updates tokens when needed, and sends activation emails.
 * @param email - The owner's email address.
 * @param token - The generated activation token.
 */
async function handleOwnerSignup(email: string, token: string) {
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

    // If all checks pass, update the activation token
    await updateOwnerToken(email, token);
  } else {
    // If user does not exist, create a new owner record with the token
    await createOwnerWithToken(email, token);
  }

  // Send activation email to the owner
  await sendActivation(email, token);
}

/**
 * Handles the signup process for an agent.
 * Checks for existing agents, creates new records, and sends review notifications.
 * @param formData - The agent's submitted data.
 * @param token - The generated activation token.
 */
async function handleAgentSignup(formData: any, token: string) {
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = formData;
  try {
    // Check if an agent already exists with the same email or address
    const agent = await findBusinessOwner(email, addressLine);

    // Handle existing agent
    handleExistingAgent(agent, addressLine);

    // If agent does not exist, create a new record with the token
    await createBusinessOwnerWithToken(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber, token);

    // Notify internal team for agent review
    await sendAgentReview(formData, token);

    // Send an email to the agent informing them of the review process
    await sendToAgentReview(formData);
  } catch (error) {
    throw error;
  }
}

/**
 * Handles cases where an agent already exists.
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
