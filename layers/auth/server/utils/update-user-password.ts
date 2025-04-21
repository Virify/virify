import type { UserSession } from "#auth-utils";
import { H3Event } from "h3";
import { findUserById, findUserByPasswordToken, updateUserPasswordById } from "~~/layers/database/server/utils/user";
/**
 * Updates or creates a new password for the user using the password token.
 *
 * @param passwordToken string
 * @param password string
 * @returns Object
 */
export async function updatePasswordByToken(passwordToken: string, password: string) {
  try {
    const user = await findUserByPasswordToken(passwordToken);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid token." });

    const verifiedPassword = await verifyPassword(user.password as string, password);

    if (verifiedPassword) throw createError({ statusCode: 400, statusMessage: "New password cannot be the same as the old password" });

    const hashedPassword = await hashPassword(password);
    await updateUserPasswordById(user.id, hashedPassword);

    return {
      message: "Password updated successfully",
      user: user,
      redirect: "/login?success=Password%20updated%20successfully",
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the user password via their profile if they are in auth session
 * 
 * @param event H3Event
 * @param password string
 * @returns Object
 */
export async function updatePasswordBySession(event: H3Event, password: string) {
  // if user is logged in
  const session = (await getUserSession(event)) as UserSession;
  const userId = session?.user?.id;

  if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const user = await findUserById(userId);

  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

  // Check if the new password is the same as the old password
  const verifiedPassword = await verifyPassword(user.password as string, password);

  if (verifiedPassword) throw createError({ statusCode: 400, statusMessage: "New password cannot be the same as the old password" });

  const hashedPassword = await hashPassword(password);
  await updateUserPasswordById(userId, hashedPassword);

  return {
    message: "Password updated successfully",
  };
}
