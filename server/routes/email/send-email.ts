export default defineEventHandler(async (event) => {
  console.log(event)
  const { subject, content, to } = getQuery(event);
  console.log(subject, content, to);

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
    console.log(error);
  }
});
