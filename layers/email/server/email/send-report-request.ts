import { render } from "@vue-email/render";
import reportRequest from "../../components/email/templates/report-request.vue";
import { sesSender } from "../utils/ses-sender";

/**
 * Sends a report request email to the internal support team.
 *
 * @param email - The user's email address.
 * @param type - The type of report request.
 * @param details - The details of the report request.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendReportRequest(
  email: string,
  type: string,
  details: string,
  listingId?: number,
  conversationId?: number,
  messageId?: number,
  message?: string,
  userId?: number,
) {
  // Get the Vue email template
  const emailToSend = reportRequest;

  // Render the email to HTML
  const emailHtml = await render(emailToSend, {
    email,
    type,
    details,
    listingId,
    conversationId,
    messageId,
    message,
    userId,
  });

  // Set the email subject, HTML content, and recipient address
  const subject = `New Report Request: ${type} from ${email}`;

  // Use the INTERNAL_EMAIL from environment variables or fallback
  const config = useRuntimeConfig();
  const to = (config.INTERNAL_EMAIL as string) || "all@virify.co.uk";

  // Send the email
  return await sesSender(emailHtml, subject, to);
}
