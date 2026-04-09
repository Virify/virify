<template>
  <LazyOrganismsDashboardEnquiryModal 
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
const { isModalOpen, modalConversation, newEnquiryData, openConversation, closeConversation, syncConversationIfOpen } = useGlobalEnquiryModal();
const toast = useToast();
const { user } = useUserSession();

// Clean up when the modal is closed via UModal's own controls (X button, backdrop click, etc.)
watch(isModalOpen, (open) => {
  if (!open) closeConversation();
});

watch(lastNotification, (notification) => {
  if (notification) {
    const notifConvId = notification.conversationId;
    const isViewingNotif = notification.type?.startsWith("VIEWING_");

    // Suppress if this client is already viewing that conversation in ANY modal
    if (
      !isViewingNotif &&
      notifConvId && (
        activeEnquiryId.value === notifConvId ||
        (isModalOpen.value && modalConversation.value?.id === notifConvId)
      )
    ) {
      return;
    }

    toast.add({
      title: notification.title,
      description: notification.description,
      ...(notification.senderAvatar
        ? { avatar: { src: notification.senderAvatar, alt: notification.senderUsername || 'User' } }
        : { icon: isViewingNotif ? 'i-lucide-calendar-check' : 'i-lucide-message-circle' }),
      color: 'secondary',
      onClick: async () => {
        if (isViewingNotif) {
          const type = notification.type as string;
          const tab = type === 'VIEWING_REQUEST' ? 'requested'
            : type === 'VIEWING_RESCHEDULED' ? 'rescheduled'
            : 'all';
          await navigateTo(`/dashboard/viewings?tab=${tab}`);
        } else if (notification.conversationId) {
          await openConversation(notification.conversationId);
        } else {
          await navigateTo('/dashboard/enquiries');
        }
      },
    });
  }
});
</script>
