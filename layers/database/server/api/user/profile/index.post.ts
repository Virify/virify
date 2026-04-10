/**
 * API Endpoint to update user profile information, including changing the password.
 * Validation is performed using shared zod schema.
 */
import * as z from "zod";
import { profileCreateUsernameSchema } from "~~/shared/utils/profile-create-schema";
import { updateUserUsernameById } from "../../../utils/user";
import { H3Event, EventHandlerRequest } from "h3";

const querySchema = z.object({
  schema: z.enum(["username", "createProfile"]).default("createProfile"),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const { schema } = await getValidatedQuery(event, querySchema.parse);

    if (schema === "username") {
      return await handleUsernameUpdate(event, user.id);
    }

    return await handleProfileCreation(event, user.id);
  } catch (error: any) {
    // Prisma unique constraint violation — username already taken
    if (error?.code === 'P2002' && error?.meta?.target?.includes('username')) {
      throw createError({ statusCode: 400, statusMessage: 'That username is already taken. Please choose another.' });
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An unexpected error occurred.',
    });
  }
});

/**
 * 
 * @param event H3 Event
 * @param userId User Id
 * @returns 200
 */
async function handleUsernameUpdate(event: H3Event<EventHandlerRequest>, userId: number): Promise<{ success: true }> {
  const { username, firstName, lastName } = await readValidatedBody(event, profileCreateUsernameSchema.parse);

  const updatedUser = await updateUserUsernameById(userId, username, firstName, lastName);
  await loginUser(event, updatedUser);

  return { success: true };
}

/**
 * 
 * @param event H3 Event
 * @param userId User ID
 * @returns 200
 */
async function handleProfileCreation(event: H3Event<EventHandlerRequest>, userId: number): Promise<{ success: true }> {
  const { username, firstName, lastName, newPassword } = await readValidatedBody(event, profileCreateSchema.parse);

  const userRecord = await getUserWithVerificationAndMembershipById(userId);

  if (!userRecord) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  validateProfileNotComplete(userRecord);
  validatePasswordNotSet(userRecord);

  const hashedNewPassword = await hashPassword(newPassword);
  const updatedUser = await updateUserById(userId, username, hashedNewPassword, "ACTIVATED", firstName, lastName);
  
  await loginUser(event, updatedUser);

  return { success: true };
}

/**
 * Validate that the profile is not already complete
 * @param userRecord User
 */
function validateProfileNotComplete(userRecord: UserWithVerificationAndMembership) {
  const isComplete = (userRecord.username && userRecord.password) || userRecord.verification?.activated === "ACTIVATED";
  
  if (isComplete) {
    throw createError({ statusCode: 400, statusMessage: "Profile already completed" });
  }
}

/**
 * Validate that the password is not already set
 * @param userRecord User
 */
function validatePasswordNotSet(userRecord: UserWithVerificationAndMembership) {
  if (userRecord.password) {
    throw createError({ statusCode: 400, statusMessage: "Password already set" });
  }
}
