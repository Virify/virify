import { render } from "@vue-email/render";
import AgentDenied from "../../routes/email/templates/agent-denied.vue";
import emailSender from "./email-sender";

/**
 * Sends an activation email to the user.
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendAgentActivation(email: string, agent: BusinessOwnerWithVerification) {
  // Get the Vue email template
  const emailToSend = AgentDenied;
  try {
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
      baseUrl: process.env.EMAIL_BASE_URL || "",
    });

    // Set the email subject, HTML content, and recipient address
    const subject = "Your account has been denied";
    const html = emailHtml;
    const to = email;

    // Send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    return error;
  }
}
