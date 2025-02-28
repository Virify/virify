/**
 * Sends an email using NodeMailer.
 * @param html - The HTML content of the email.
 * @param subject - The subject of the email.
 * @param to - The recipient's email address.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export default async function emailSender(html: string, subject: string, to: string) {
  try {
    // Import the sendMail function from NodeMailer
    const { sendMail } = useNodeMailer();

    // Send the email with the provided subject, HTML content, and recipient address
    return await sendMail({ subject: subject, html: html, to: to });
  } catch (error) {
    // Throw an error if there is an issue sending the email
    throw new Error("Error sending email " + error);
  }
}
