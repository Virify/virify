import sendActivation from "~~/server/email/send-password-reset";
import { BusinessOwnerWithVerification } from "~~/server/utils/owner";

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  try {
    if (!validateEmail(email)) throw createError({ statusCode: 400, statusMessage: "Invalid email address" });

    // check if the email exists in the database
    const dbOwner = await findOwnerWithVerification(email);

    //validate owner
    validateOwner(dbOwner!);

    // create a specific token for the user
    const token = await generateToken();

    // save the token to the database for the user of which email they sent
    await updateOwnerByEmailPasswordReset(email, token);

    // now we need to send them an email with the token
    await sendActivation(email, token);

    // return a success message
    return { message: "Email sent successfully" };
  } catch (error) {
    throw error;
  }
});

/**
 * Check if email is valid/activate and does not already have a password reset token
 * @param owner
 */
function validateOwner(owner: BusinessOwnerWithVerification): void {
  if (!owner) throw createError({ statusCode: 400, statusMessage: "User not found" });
  if (!owner?.verification?.activated) throw createError({ statusCode: 400, statusMessage: "User not activated" });
  if (owner.passwordResetToken) throw createError({ statusCode: 400, statusMessage: "Password reset token already exists" });
}
