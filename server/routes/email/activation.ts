import { render } from '@vue-email/render'
import activationEmail from './emails/signup-activation.vue'
export default defineEventHandler(async (event) => {
  // const { subject, content, to } = await readBody(event);
  // get the vue file
  const email = activationEmail
  const emailHtml = await render(email);
  
  // get this from query params
  const subject = "Hello from Virify";
  const html = emailHtml;
  const to = "example@example.com";


  try {
    emailSender(html, subject, to);
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
});
