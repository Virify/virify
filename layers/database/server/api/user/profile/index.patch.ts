export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, profileSchema.parse);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const updatedUser = await updateUserProfileData(user.id, body);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to update user profile",
    });
  }
});
