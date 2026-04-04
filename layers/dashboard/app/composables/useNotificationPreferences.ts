import { z } from "zod";
import { createSharedComposable } from "@vueuse/core";
import { notificationPreferencesSchema } from "~~/shared/utils/notification-preferences-schema";
import type { FormSubmitEvent } from "#ui/types";

type Schema = z.output<typeof notificationPreferencesSchema>;

export const useNotificationPreferences = createSharedComposable(() => {
  const toast = useToast();

  const { data, pending } = useAsyncData("notificationPreferences", () =>
    useRequestFetch()<Schema>("/api/user/notifications"),
  );

  const state = reactive<Schema>({
    receiveEmailNotifications: true,
    receivePushNotifications: true,
    receiveDesktopNotifications: true,
  });

  watch(
    data,
    (prefs) => {
      if (prefs) {
        state.receiveEmailNotifications = prefs.receiveEmailNotifications;
        state.receivePushNotifications = prefs.receivePushNotifications;
        state.receiveDesktopNotifications = prefs.receiveDesktopNotifications;
      }
    },
    { immediate: true },
  );

  const canEmail = computed(() => state.receiveEmailNotifications);
  const canPush = computed(() => state.receivePushNotifications);
  const canDesktop = computed(() => state.receiveDesktopNotifications);

  const saving = ref(false);

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    saving.value = true;
    try {
      await useRequestFetch()("/api/user/notifications", {
        method: "PATCH",
        body: event.data,
      });
      toast.add({ title: "Success", description: "Notification preferences updated", color: "success" });
    } catch (error: any) {
      toast.add({ title: "Error", description: error?.message || "Failed to update notification preferences", color: "error" });
    } finally {
      saving.value = false;
    }
  }

  return {
    state,
    pending,
    saving,
    onSubmit,
    notificationPreferencesSchema,
    canEmail,
    canPush,
    canDesktop,
  };
});
