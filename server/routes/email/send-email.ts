export default defineEventHandler(async (event) => {
  const { subject, content, to } = await readBody(event);

  try {
    // use composable
    const { sendMail } = useNodeMailer();
    // send email
    sendMail({ subject: subject, text: content, to: to });
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
