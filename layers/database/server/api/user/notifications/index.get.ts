export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const preferences = await prisma.userNotificationPreferences.findFirst({
    where: {
      userPreferences: { userId: user.id },
    },
    select: {
      receiveEmailNotifications: true,
      receivePushNotifications: true,
      receiveDesktopNotifications: true,
    },
  });

  return preferences ?? {
    receiveEmailNotifications: true,
    receivePushNotifications: true,
    receiveDesktopNotifications: true,
  };
});
