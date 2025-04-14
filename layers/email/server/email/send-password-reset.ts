import { render } from "@vue-email/render";
import PasswordReset from "../../components/email/templates/password-reset.vue";
import { sesSender } from "../utils/ses-sender";
const config = useRuntimeConfig();

/**
 * Sends a password reset email to the user.
 *
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function sendPasswordReset(email: string, token: string) {
  // Get the Vue email template
  const emailToSend = PasswordReset;

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
  return await sesSender(html, subject, to);
}
