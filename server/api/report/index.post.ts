import sendReportRequest from "../../../layers/email/server/email/send-report-request";
import * as z from "zod";

const reportSchemaWithToken = reportSchema.extend({
  turnstileToken: z.string().min(1, "Turnstile token is required"),
});

export default defineEventHandler(async (event) => {
  try {
    // Get the request body
    const {
      email,
      type,
      details,
      turnstileToken,
      listingId,
      conversationId,
      messageId,
      message,
      userId,
    } = await readValidatedBody(event, reportSchemaWithToken.parse);

    // Verify Turnstile token
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);

    if (!isValidToken) {
      throw createError({
        statusCode: 403,
        statusMessage: "Bot verification failed. Please try again.",
      });
    }

    // Validate type
    const validTypes = [
      "inappropriate-content",
      "incorrect-information",
      "inaccurate-listing",
      "other",
    ];
    if (!validTypes.includes(type)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid report type",
      });
    }

    // Send the report request email
    await sendReportRequest(
      email,
      type,
      details,
      listingId,
      conversationId,
      messageId,
      message,
      userId,
    );

    return {
      success: true,
      message: "Report request sent successfully",
    };
  } catch (error) {
    console.error("Report request error:", error);

    // If it's already a proper error with statusCode, throw it as is
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Otherwise, throw a generic server error
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send report request",
    });
  }
});
