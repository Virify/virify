import { z } from "zod";
import { sendContactEnquiry } from "~~/layers/email/server/email/send-contact-enquiry";

const contactSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Valid email is required"),
  telephone: z.string().optional(),
  enquiry: z.string().min(10, "Enquiry must be at least 10 characters"),
  turnstileToken: z.string().min(1, "Bot verification is required"),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();

  try {
    const body = await readValidatedBody(event, contactSchema.parse);
    const { name, email, telephone, enquiry, turnstileToken } = body;

    const clientIp = getRequestIP(event, { xForwardedFor: true }) || "";
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);

    if (!isValidToken) {
      throw createError({
        statusCode: 403,
        statusMessage: "Bot verification failed. Please try again.",
      });
    }

    await sendContactEnquiry(name, email, telephone || "", enquiry);

    return {
      success: true,
      message: "Thank you for your enquiry. We'll get back to you as soon as possible.",
    };
  } catch (error: any) {
    console.error("Contact form error:", error);
    return errorResponse(error, event);
  }
});
