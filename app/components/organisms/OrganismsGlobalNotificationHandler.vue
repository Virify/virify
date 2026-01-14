<template>
  <OrganismsDashboardEnquiryModal 
    v-if="modalConversation && user" 
    v-model:open="isModalOpen" 
    :conversation="modalConversation" 
    :user="user" 
  />
</template>

<script setup lang="ts">
// Watch for global notifications triggered by plugins/websockets
const { lastNotification, activeConversationId } = useNotifications();
const { isModalOpen, modalConversation, openConversation, syncConversationIfOpen } = useGlobalEnquiryModal();
const toast = useToast();
const { user } = useUserSession();

watch(lastNotification, (notification) => {
  if (notification) {
    const notifConvId = notification.data?.conversationId;

    // Check if ANY modal is currently viewing this conversation
    if (activeConversationId.value && notifConvId && activeConversationId.value === notifConvId) {
      // If the global handler's modal is the one open, update its state
      if (notification.data?.conversation) {
        syncConversationIfOpen(notification.data.conversation);
      }
      // Suppress toast completely
      return;
    }

    toast.add({
      title: notification.title,
      description: notification.data?.message?.content || 
      notification.data?.conversation?.messages?.slice(-1)[0]?.content || 
      notification.description,
      icon: 'i-heroicons-chat-bubble-left-right',
      color: 'secondary',
      onClick: async () => {
        if (notification.data?.conversation) {
          openConversation(notification.data.conversation);
        } else {
          navigateTo('/dashboard/enquiries');
        }
      },
    });
  }
});
</script>
