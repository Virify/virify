import sendActivation from "~~/server/email/send-password-reset";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email(),
});
/**
 * Send password reset email to the user from the email address
 * @param event - The H3 event object containing the request data.
 * @returns A standardized HTTP response indicating whether the email was sent successfully.
 * @throws Will throw an error if the email is invalid, user not found, or token already exists.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const requestBody = await readBody(event);

    // parse and validate the request body
    const { email } = await emailSchema.parse(requestBody);
    
    // check if the email exists in the database
    const dbOwner = await findOwnerWithVerification(email);

    //validate owner
    validateOwner(dbOwner);

    // create a specific token for the user
    const token = generateToken();

    // save the token to the database for the user of which email they sent
    await updateOwnerByEmailPasswordReset(email, token);

    // now we need to send them an email with the token
    await sendActivation(email, token);

    // return a success message
    return { message: "Email sent successfully" };
  } catch (error) {
    errorResponse(error);
    throw error;
  }
});

/**
 * Check if email is valid/activate and does not already have a password reset token
 * @param owner
 */
function validateOwner(owner: BusinessOwnerWithVerification | null): void {
  if (!owner) throw createError({ statusCode: 400, statusMessage: "User not found" });
  if (!owner?.verification?.activated) throw createError({ statusCode: 400, statusMessage: "User not activated" });
  if (owner.passwordResetToken) throw createError({ statusCode: 400, statusMessage: "Password reset token already exists" });
}
