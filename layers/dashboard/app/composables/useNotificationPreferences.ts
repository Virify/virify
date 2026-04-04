import { z } from "zod";
import { createSharedComposable } from "@vueuse/core";
import { notificationPreferencesSchema } from "~~/shared/utils/notification-preferences-schema";
import type { FormSubmitEvent } from "#ui/types";

type Schema = z.output<typeof notificationPreferencesSchema>;

export const useNotificationPreferences = createSharedComposable(() => {
  const toast = useToast();
  const { loggedIn } = useUserSession();

  const { data, pending } = useAsyncData("notificationPreferences", () =>
    useRequestFetch()<Schema>("/api/user/notifications"),
    { immediate: false }
  );

  watch(loggedIn, (isLoggedIn) => {
    if (isLoggedIn) refreshNuxtData("notificationPreferences");
    else data.value = undefined;
  }, { immediate: true });

  const state = reactive<Schema>({
    receiveEmailNotifications: true,
    receivePushNotifications: true,
    receiveDesktopNotifications: false,
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

  // Browser Notification API permission status (client-only)
  const browserPermission = ref<NotificationPermission | null>(null);

  if (import.meta.client) {
    browserPermission.value = Notification.permission;

    // When user enables desktop notifications, request browser permission
    watch(
      () => state.receiveDesktopNotifications,
      async (enabled) => {
        if (!enabled) return;
        if (Notification.permission === 'granted') return;
        if (Notification.permission === 'denied') {
          // Browser has blocked it — can't re-request, revert the toggle
          state.receiveDesktopNotifications = false;
          toast.add({
            title: 'Permission blocked',
            description: 'Desktop notifications are blocked in your browser settings. Please enable them manually.',
            color: 'warning',
          });
          return;
        }
        const result = await Notification.requestPermission();
        browserPermission.value = result;
        if (result !== 'granted') {
          state.receiveDesktopNotifications = false;
          toast.add({
            title: 'Permission not granted',
            description: 'Desktop notifications were not enabled.',
            color: 'warning',
          });
        }
      },
    );
  }

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
    browserPermission,
  };
});
