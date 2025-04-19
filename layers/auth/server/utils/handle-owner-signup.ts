import { createOwnerWithTokens, updateOwnerTokens, type OwnerWithVerification, findOwnerWithVerification } from "~~/layers/database/server/utils/owner";
import handleExistingUser from "./handle-existing-user";
import sendActivation from "~~/layers/email/server/email/send-owner-activation";


/**
 * Handles the signup process for an owner.
 * Validates existing users, updates tokens when needed, and sends activation emails.
 * @param email - The owner's email address.
 * @param token - The generated activation token.
 * @param otpCode - The generated OTP code.
 */
export default async function handleOwnerSignup(email: string, token: string, otpCode: string) {
  const existingUser = await findOwnerWithVerification(email);

  if (existingUser) {
    return await handleExistingUser(existingUser, token, otpCode);
  }

  await sendActivation(email, token, otpCode);
  // we create a new user with the token and otpCode
  return await createOwnerWithTokens(email, token, otpCode);
}