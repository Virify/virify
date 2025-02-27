import { render } from "@vue-email/render";
import activationEmail from "../routes/email/emails/signup-activation.vue";
export default async function sendActivation(email: string, token: string) {
  // get the vue email template
  const emailToSend = activationEmail;
  // render the email to html
  const emailHtml = await render(emailToSend, {
    token,
    userEmail: email,
  });
  // set the email subject etc
  const subject = "Welcome to Virify - Activate Required!";
  const html = emailHtml;
  const to = email;

  try {
    // send the email
    await emailSender(html, subject, to);
    return {
      status: 200,
      body: {
        message: "Email sent",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      body: {
        message: "Error sending email",
      },
    };
  }
}
