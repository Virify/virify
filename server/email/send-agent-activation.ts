import { render } from "@vue-email/render";
import AgentActivation from "./templates/agent-activation.vue";

/**
 * Sends a activation email to the user.
 * 
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendAgentActivation(email: string, token: string) {
  // Get the Vue email template
  const emailToSend = AgentActivation;
  try {
    // Render the email to HTML
    const emailHtml = await render(emailToSend, {
      token,
      baseUrl: process.env.EMAIL_BASE_URL || "",
    });

    // Set the email subject, HTML content, and recipient address
    const subject = "Approved! Activate your account now!";
    const html = emailHtml;
    const to = email;

    // Send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    throw error;
  }
}
