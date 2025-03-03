import { Prisma, Reviewed } from "@prisma/client";
import sendAgentVerification from "~~/server/utils/email/send-agent-verification";
/**
 * Endpoint to handle agent signup.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response indicating the result of the signup process.
 */
export default defineEventHandler(async (event) => {
  // Extract form data from the request body
  const { email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber } = await readBody(event);
  const { successResponse } = useResponse();

  // Validate the request body
  const formData = {
    email,
    businessName,
    mainContact,
    addressLine,
    city,
    county,
    country,
    postcode,
    registrationNumber,
  };

  try {
    // Check if the agent exists
    const agent = await findBusinessOwner(email);

    // Handle existing agent
    handleExistingAgent(agent);

    const token = generateToken();

    // Create the agent
    await createBusinessOwner(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber, token);

    // Send the review email
    await sendAgentVerification(formData, token as string);

    return successResponse("Agent created successfully");
  } catch (err) {
    return err;
  }
});

/**
 * Handles the case where an agent already exists.
 * @param agent - The existing agent object.
 * @throws An error if the agent already exists and is pending review.
 */
function handleExistingAgent(agent: Prisma.OwnerGetPayload<{ include: { verification: true } }> | null): void {
  if (agent) {
    if (agent.verification?.reviewed === Reviewed.PENDING) {
      throw createError({ statusCode: 400, statusMessage: "Agent already exists and is pending review" });
    }
    throw createError({ statusCode: 400, statusMessage: "Agent already exists" });
  }
}
