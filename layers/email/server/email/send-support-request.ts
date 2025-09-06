import { render } from "@vue-email/render";
import supportRequest from "../../components/email/templates/support-request.vue";
import { sesSender } from "../utils/ses-sender";

/**
 * Sends a support request email to the internal support team.
 *
 * @param name - The user's name.
 * @param email - The user's email address.
 * @param type - The type of support request.
 * @param details - The details of the support request.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendSupportRequest(
  name: string, 
  email: string, 
  type: string, 
  details: string
) {
  // Get the Vue email template
  const emailToSend = supportRequest;

  // Render the email to HTML
  const emailHtml = await render(emailToSend, {
    name,
    email,
    type,
    details,
  });

  // Set the email subject, HTML content, and recipient address
  const subject = `New Support Request: ${type} from ${name}`;
  const html = emailHtml;
  
  // Use the INTERNAL_EMAIL from environment variables or fallback
  const config = useRuntimeConfig();
  const to = (config.INTERNAL_EMAIL as string) || 'all@virify.co.uk';

  // Send the email
  return await sesSender(html, subject, to);
}