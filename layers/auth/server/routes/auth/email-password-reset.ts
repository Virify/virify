import sendPasswordReset from "~~/layers/email/server/email/send-password-reset";
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
    const { email } = await readValidatedBody(event, emailSchema.parse);

    const dbOwner = await findOwnerWithVerification(email);
    validateOwner(dbOwner);
    const token = generateToken();
    await sendPasswordReset(email, token);
    await updateOwnerByEmailPasswordReset(email, token);

    return { message: "Email sent successfully" };
  } catch (error) {
    return errorResponse(error, event);
  }
});

/**
 * Check if email is valid/activate and does not already have a password reset token
 * @param owner
 */
function validateOwner(owner: OwnerWithVerification | null): void {
  if (!owner) throw createError({ statusCode: 400, statusMessage: "User not found" });
  if (!owner?.verification?.activated) throw createError({ statusCode: 400, statusMessage: "User not activated" });
  if (owner.passwordResetToken) throw createError({ statusCode: 400, statusMessage: "Password reset token already exists" });
}
