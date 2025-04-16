import { render } from "@vue-email/render";
import AgentDenied from "../../components/email/templates/agent-denied.vue";
import { sesSender } from "../utils/ses-sender";
const config = useRuntimeConfig();

/**
 * Sends a rejection email to the user.
 *
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendAgentRejection(email: string, agent: BusinessOwnerWithVerification) {
  // Get the Vue email template
  const emailToSend = AgentDenied;

  // Render the email to HTML
  const emailHtml = await render(emailToSend, {
    email: email,
    businessName: agent.businessName!,
    mainContact: agent.mainContact!,
    addressLine: agent.addressLine1!,
    city: agent.city!,
    county: agent.county!,
    country: agent.country!,
    postcode: agent.postcode!,
    registrationNumber: agent.companyRegistration!,
    baseUrl: config.public.EMAIL_BASE_URL,
  });

  // Set the email subject, HTML content, and recipient address
  const subject = "Your account has been denied";
  const html = emailHtml;
  const to = email;

  // Send the email
  return await sesSender(html, subject, to);
}
