import { render } from "@vue-email/render";
import AgentReview from "./templates/agent-review.vue";
const config = useRuntimeConfig();

/**
 * Sends a review email to the internal team
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

export default async function sendAgentReview(formData: FormData, token: string) {
  // Get the Vue email template
  const emailToSend = AgentReview;

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
    baseUrl: config.public.EMAIL_BASE_URL,
    token: token,
  });

  // Set the email subject, HTML content, and recipient address
  const subject = "New Estate Agent Review Required";
  const html = emailHtml;
  const to = config.public.INTERNAL_EMAIL;

  // Send the email
  return await sesSender(html, subject, to);
}
