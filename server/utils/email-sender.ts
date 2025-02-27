export default function emailSender(html: string, subject: string, to: string) {
  try {
    const { sendMail } = useNodeMailer();
    sendMail({ subject: subject, html: html, to: to });
  } catch (error) {
    throw new Error("Error sending email " + error);
  }
}
