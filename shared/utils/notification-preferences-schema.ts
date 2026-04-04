import z from "zod";

export const notificationPreferencesSchema = z.object({
  receiveEmailNotifications: z.boolean(),
  receivePushNotifications: z.boolean(),
  receiveDesktopNotifications: z.boolean(),
});

export type NotificationPreferencesSchemaType = z.output<typeof notificationPreferencesSchema>;
