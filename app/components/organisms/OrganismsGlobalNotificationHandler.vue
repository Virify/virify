<template>
  <OrganismsDashboardEnquiryModal
    v-if="user"
    v-model:open="isModalOpen"
    :conversation="modalConversation"
    :user="user"
    :new-enquiry-data="newEnquiryData"
  />
</template>

<script setup lang="ts">
  // Watch for global notifications triggered by plugins/websockets
  const { lastNotification } = useNotifications();
  const { activeEnquiryId } = useEnquiries();
  const {
    isModalOpen,
    modalConversation,
    newEnquiryData,
    openConversation,
    closeConversation,
    syncConversationIfOpen,
  } = useGlobalEnquiryModal();
  const toast = useToast();
  const { user } = useUserSession();
  const { canDesktop } = useNotificationPreferences();

  // Clean up when the modal is closed via UModal's own controls (X button, backdrop click, etc.)
  watch(isModalOpen, (open) => {
    if (!open) closeConversation();
  });

  watch(lastNotification, (notification) => {
    if (notification) {
      const notifConvId = notification.conversationId;
      const isViewingNotif = notification.type?.startsWith("VIEWING_");
      const isOwnershipNotif =
        notification.type === "OWNERSHIP_VERIFIED" ||
        notification.type === "OWNERSHIP_DENIED";

      const { color, icon } = getNotificationToastStyle(notification.type);

      // Refresh viewings list so the other party sees the latest status
      if (isViewingNotif) {
        const { fetchViewings } = useViewings();
        fetchViewings().catch(() => {});
      }

      // Suppress if this client is already viewing that conversation in ANY modal
      if (
        !isViewingNotif &&
        !isOwnershipNotif &&
        notifConvId &&
        (activeEnquiryId.value === notifConvId ||
          (isModalOpen.value && modalConversation.value?.id === notifConvId))
      ) {
        return;
      }

      toast.add({
        title: notification.title,
        description: notification.description,
        ...(notification.senderAvatar ?
          {
            avatar: {
              src: notification.senderAvatar,
              alt: notification.senderUsername || "User",
            },
          }
        : { icon }),
        color,
        onClick: async () => {
          if (isOwnershipNotif) {
            await navigateTo("/dashboard/draft-listings");
          } else if (isViewingNotif) {
            const tab = getViewingTab(notification.type as string);
            closeConversation();
            const router = useRouter();
            await router.push(`/dashboard/viewings?tab=${tab}`);
          } else if (notification.conversationId) {
            await openConversation(notification.conversationId);
          } else {
            await navigateTo("/dashboard/enquiries");
          }
        },
      });

      // Fire browser desktop notification if user has enabled it and permission is granted
      if (
        import.meta.client &&
        canDesktop.value &&
        Notification.permission === "granted"
      ) {
        const desktopNotif = new Notification(notification.title, {
          body: notification.description,
          icon: notification.senderAvatar || "/img/logo.png",
        });

        desktopNotif.onclick = () => {
          window.focus();
          if (notification.conversationId) {
            openConversation(notification.conversationId).catch(() => {});
          } else {
            navigateTo("/dashboard/enquiries");
          }
        };
      }
    }
  });
</script>
