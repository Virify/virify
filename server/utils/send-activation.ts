import { render } from "@vue-email/render";
import activationEmail from "../routes/email/emails/signup-activation.vue";
export default async function sendActivation(email: string, token: string) {
  // get the vue email template
  const emailToSend = activationEmail;
  // render the email to html
  const emailHtml = await render(emailToSend, {
    token,
    userEmail: email,
    baseUrl: process.env.EMAIL_BASE_URL || '',
  });
  // set the email subject etc
  const subject = "Welcome to Virify - Activate Required!";
  const html = emailHtml;
  const to = email;

  try {
    // send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    throw new Error("Error sending activation email " + error);
  }
}
