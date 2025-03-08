import { render } from "@vue-email/render";
import ToAgentReview from "./templates/to-agent-review.vue";

/**
 * Sends a review email to the user.
 *
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

export default async function sendToAgentReview(formData: FormData) {
  // Get the Vue email template
  const emailToSend = ToAgentReview;

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
  });

  // Set the email subject, HTML content, and recipient address
  const subject = "Thank you for signing up!";
  const html = emailHtml;
  const to = formData.email;

  try {
    // Send the email
    return await emailSender(html, subject, to);
  } catch (error) {
    throw error;
  }
}
