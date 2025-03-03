/**
 * Validates the form data for agent signup.
 * @param formData - The form data to validate.
 * @returns An object containing validation errors, if any.
 */
export default function validateAgentSignupForm(formData: { [key: string]: any }): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.businessName) {
    errors.businessName = "Business name is required";
  }

  if (!formData.mainContact) {
    errors.mainContact = "Main contact is required";
  }

  if (!formData.addressLine) {
    errors.addressLine = "Address line is required";
  }

  if (!formData.city) {
    errors.city = "City is required";
  }

  if (!formData.county) {
    errors.county = "County is required";
  }

  if (!formData.country) {
    errors.country = "Country is required";
  }

  if (!formData.postcode) {
    errors.postcode = "Postcode is required";
  }

  if (!formData.registrationNumber) {
    errors.registrationNumber = "Registration number is required";
  }

  return errors;
}