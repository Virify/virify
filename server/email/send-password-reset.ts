import { render } from "@vue-email/render";
import PasswordReset from "./templates/password-reset.vue";
const config = useRuntimeConfig();

/**
 * Sends a password reset email to the user.
 * 
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendActivation(email: string, token: string) {
  // Get the Vue email template
  const emailToSend = PasswordReset;
  try {
    // Render the email to HTML
    const emailHtml = await render(emailToSend, {
      token,
      baseUrl: config.public.EMAIL_BASE_URL,
    });

    // Set the email subject, HTML content, and recipient address
    const subject = "Password Reset Requested!";
    const html = emailHtml;
    const to = email;

    // Send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    throw error;
  }
}
