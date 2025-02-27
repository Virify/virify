export default defineEventHandler(async () => {
  try {
    // use composable
    const { sendMail } = useNodeMailer();
    // send email
    sendMail({ subject: "TEST NO-REPLY MAILBOX", text: "Well this was fun to test", to: "test@test.com" });
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
