import { notificationPreferencesSchema } from "~~/shared/utils/notification-preferences-schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readValidatedBody(event, notificationPreferencesSchema.parse);

  // Ensure UserPreferences exists for this user
  const userPreferences = await prisma.userPreferences.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
    select: { userId: true },
  });

  // Find existing notification preferences row
  const existing = await prisma.userNotificationPreferences.findFirst({
    where: { userPreferencesId: userPreferences.userId },
    select: { id: true },
  });

  const selectFields = {
    receiveEmailNotifications: true,
    receivePushNotifications: true,
    receiveDesktopNotifications: true,
  } as const;

  const updated = existing
    ? await prisma.userNotificationPreferences.update({
        where: { id: existing.id },
        data: body,
        select: selectFields,
      })
    : await prisma.userNotificationPreferences.create({
        data: { userPreferencesId: userPreferences.userId, ...body },
        select: selectFields,
      });

  return updated;
});
