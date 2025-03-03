import { Prisma, Reviewed } from "@prisma/client";
import sendAgentReview from "~~/server/utils/email/send-agent-review";
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
    const agent = await findBusinessOwner(email, addressLine);

    // Handle existing agent
    handleExistingAgent(agent, addressLine);

    const token = generateToken();

    // Create the agent
    await createBusinessOwnerWithToken(email, businessName, mainContact, addressLine, city, county, country, postcode, registrationNumber, token);

    // Send the review email
    await sendAgentReview(formData, token as string);

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
function handleExistingAgent(agent: Prisma.OwnerGetPayload<{ include: { verification: true } }> | null, address: string): void {
  if (agent) {
    
    if (agent.verification?.reviewed === Reviewed.PENDING) {
      throw createError({ statusCode: 400, statusMessage: "Agent already exists and is pending review" });
    }

    if (agent.verification?.reviewed === Reviewed.REJECTED) {
      throw createError({ statusCode: 400, statusMessage: "Agent already exists and was rejected. Contact us for more information" });
    }

    if(agent.addressLine1 === address) throw createError({ statusCode: 400, statusMessage: "Agent already registered at that address!" });

    throw createError({ statusCode: 400, statusMessage: "Agent already exists" });
  }
}
