import { render } from "@vue-email/render";
import waitingListConfirmation from "../../components/email/templates/waiting-list-confirmation.vue";
import { sesSender } from "../utils/ses-sender";

/**
 * Sends a confirmation email to users who join the waiting list.
 *
 * @param email - The recipient's email address.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export async function sendWaitingListConfirmation(email: string) {
  // Get the Vue email template
  const emailToSend = waitingListConfirmation;

  // Render the email to HTML
  const emailHtml = await render(emailToSend, {
    email,
  });

  // Set the email subject, HTML content, and recipient address
  const subject = "Welcome to Virify - You're on the Waiting List!";
  const html = emailHtml;
  const to = email;

  // Send the email
  return await sesSender(html, subject, to);
}
