import sendActivation from "~~/server/utils/email/send-activation";
/**
 * Handles the signup request for owners.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  const { successResponse, internalServerError } = useResponse();

  try {
    // Normalize and trim the email
    const normalizedEmail = (email as string).trim();

    // Generate a new activation token
    const token = generateToken();

    // Check if the user already exists
    const existingUser = await findOwner(normalizedEmail);

    if (existingUser) {
      // Handle existing user cases
      if (shouldRejectSignup(existingUser)) {
        throw new Error("Signup failed! User already exists or is an agent");
      }

      // Check if the activation email has already been sent
      if (existingUser.tokenExpiry && existingUser.tokenExpiry > new Date()) {
        throw new Error("Signup failed! Activation email already sent");
      }

      // Update the owner token
      await updateOwnerToken(normalizedEmail, token);
    } else {
      // Create a new owner with the token
      await createOwnerWithToken(normalizedEmail, token);
    }

    // Send the activation email
    await sendActivation(normalizedEmail, token);

    // Return a success response
    return successResponse("Activation email sent");
  } catch (error) {
    // Return an internal server error response
    return internalServerError(error as Error);
  }
});