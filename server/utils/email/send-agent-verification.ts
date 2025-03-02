import { render } from "@vue-email/render";
import ApproveAgentOwner from "../../routes/email/templates/agent-verification.vue";
import emailSender from "./email-sender";

/**
 * Sends an activation email to the user.
 * @param email - The recipient's email address.
 * @param token - The activation token.
 * @returns A Promise that resolves when the email is sent.
 * @throws An error if there is an issue sending the email.
 */
interface FormData {
  email: string;
  businessName: string;
  mainContact: string;
  addressLine: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
  registrationNumber: string;
}

export default async function sendAgentVerification(formData: FormData) {
  // Get the Vue email template
  const emailToSend = ApproveAgentOwner;

  // Render the email to HTML
  const emailHtml = await render(emailToSend, {
    email: formData.email,
    businessName: formData.businessName,
    mainContact: formData.mainContact,
    addressLine: formData.addressLine,
    city: formData.city,
    county: formData.county,
    country: formData.country,
    postcode: formData.postcode,
    registrationNumber: formData.registrationNumber,
    baseUrl: process.env.EMAIL_BASE_URL || "",
  });

  // Set the email subject, HTML content, and recipient address
  const subject = "New Estate Agent Review Required";
  const html = emailHtml;
  const to = 'jamie@virify.co.uk';

  try {
    // Send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    return error;
  }
}
