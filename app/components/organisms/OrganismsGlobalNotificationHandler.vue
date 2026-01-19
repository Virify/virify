<template>
  <LazyOrganismsDashboardEnquiryModal 
    v-if="isModalOpen && user" 
    v-model:open="isModalOpen" 
    :conversation="modalConversation" 
    :user="user" 
  />
</template>

<script setup lang="ts">
// Watch for global notifications triggered by plugins/websockets
const { lastNotification } = useNotifications();
const { activeEnquiryId } = useEnquiries();
const { isModalOpen, modalConversation, openConversation, syncConversationIfOpen } = useGlobalEnquiryModal();
const toast = useToast();
const { user } = useUserSession();

watch(lastNotification, (notification) => {
  if (notification) {
    const notifConvId = notification.conversationId;

    // Suppress if this client is already viewing that conversation in ANY modal
    if (
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
      icon: 'i-heroicons-chat-bubble-left-right',
      color: 'secondary',
      onClick: async () => {
        if (notification.conversationId) {
          await openConversation(notification.conversationId);
        } else {
          await navigateTo('/dashboard/enquiries');
        }
      },
    });
  }
});
</script>
