import { render } from '@vue-email/render'
import email from './emails/test.vue'
export default defineEventHandler(async (event) => {
  // const { subject, content, to } = await readBody(event);
  // get the vue file
  const test = email
  const emailHtml = await render(test);
  
  const subject = "Hello from Virify";
  const html = emailHtml;
  const to = "jamie@virify.co.uk";


  try {
    // use composable
    const { sendMail } = useNodeMailer();
    // send email
    sendMail({ subject: subject, html: html, to: to });
    return {
      status: 200,
      body: {
        message: "Email sent",
      },
    };
  } catch (error) {
    console.error("Error sending email", error);
    return {
      status: 500,
      body: {
        message: "Error sending email",
      },
    };
  }
});
