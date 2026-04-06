import { notificationPreferencesSchema } from "~~/shared/utils/notification-preferences-schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readValidatedBody(event, notificationPreferencesSchema.parse);

  // Run both in parallel — userPreferencesId === user.id (references UserPreferences.userId)
  // findFirst is safe to run concurrently: if UserPreferences doesn't exist yet it returns null anyway
  const [, existing] = await Promise.all([
    prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
      select: { userId: true },
    }),
    prisma.userNotificationPreferences.findFirst({
      where: { userPreferencesId: user.id },
      select: { id: true },
    }),
  ]);

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
        data: { userPreferencesId: user.id, ...body },
        select: selectFields,
      });

  return updated;
});
