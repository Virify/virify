import { render } from "@vue-email/render";
import contactEnquiry from "../../components/email/templates/contact-enquiry.vue";
import { sesSender } from "../utils/ses-sender";

/**
 * Sends a contact enquiry email to the Virify team.
 *
 * @param name - The enquirer's name.
 * @param email - The enquirer's email address.
 * @param telephone - The enquirer's telephone number (optional).
 * @param enquiry - The enquiry message.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
export async function sendContactEnquiry(
  name: string,
  email: string,
  telephone: string,
  enquiry: string
) {
  const emailToSend = contactEnquiry;

  const emailHtml = await render(emailToSend, {
    name,
    email,
    telephone,
    enquiry,
  });

  const subject = `New Contact Enquiry from ${name}`;
  const html = emailHtml;
  const to = "enquiries@virify.co.uk";

  return await sesSender(html, subject, to);
}
