import { Reviewed } from "@prisma/client";
import sendAgentActivation from "~~/server/email/send-agent-activation";
import sendAgentRejection from "~~/server/email/send-agent-rejection";

/**
 * Endpoint to handle agent verification.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response indicating the result of the verification process.
 */
export default defineEventHandler(async (event) => {
  const { email, token, approve } = await readBody(event);
  const { successResponse } = useResponse();
  const approval = approve === "true" ? Reviewed.APPROVED : Reviewed.REJECTED;

  try {
    // Retrieve the owner along with their verification details
    const owner = await findOwnerWithVerification(email as string);

    // If the owner does not exist or has no verification details, return a 404 error
    if (!owner) throw createError({ statusCode: 404, statusMessage: "Agent not found!" });

    // If the owner has already been reviewed, return a 403 error
    if (owner?.verification?.reviewed === Reviewed.APPROVED || owner?.verification?.reviewed === Reviewed.REJECTED) {
      throw createError({ statusCode: 403, statusMessage: "Agent has already been reviewed! Please delete the email." });
    }

    // Validate the review token
    if (owner.verification?.reviewToken !== token) throw createError({ statusCode: 401, statusMessage: "Invalid Token!" });

    // Check if the review token has expired
    if (owner.verification?.reviewTokenExpiry! < new Date()) throw createError({ statusCode: 401, statusMessage: "Token expired!" });

    // If the owner is already activated, return a 403 error else update the owner and review
    if (owner.verification?.activated) {
      throw createError({ statusCode: 403, statusMessage: "Agent already activated!" });
    } else {
      // generate new token
      const token = generateToken();

      // Update the owner and review
      const ownerResult = await updateOwnerAndReview(owner.id, approval, token);

      // send the proper email to the agent
      await informAgentOfDecision(ownerResult, ownerResult.email, token);
    }

    return successResponse("Owner reviewed successfully");
  } catch (error) {
    return error;
  }
});

/**
 * Send out the activation email to the agent. or the rejection email.
 * @param agent BusinessOwnerWithVerification
 * @param email string
 */
async function informAgentOfDecision(agent: BusinessOwnerWithVerification, email: string, token: string): Promise<void> {
  // If the agent is approved, send the activation email
  if (agent.verification?.reviewed === Reviewed.APPROVED) {
    await sendAgentActivation(email, token);
  } else {
    await sendAgentRejection(email, agent);
  }
}