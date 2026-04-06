import { invalidateListingCaches } from "~~/layers/database/server/utils/cache";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, profileSchema.parse);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const updatedUser = await updateUserProfileData(user.id, body);
    await setUserSession(event, {
      user: {
        ...user,
        avatar: updatedUser.avatar || undefined,
      },
    });

    // Bust listing caches so the updated avatar/name is reflected immediately
    const userListings = await prisma.listing.findMany({
      where: { property: { userId: user.id } },
      select: { id: true },
    });
    if (userListings.length > 0) {
      await invalidateListingCaches(userListings.map((l) => l.id));
    }

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
