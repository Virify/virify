<template>
  <UChip inset color="error" :show="aggregates.unreadMessages > 0" class="relative">
    <USlideover 
      description="Your notifications"
      :ui="{
        body: 'sm:p-0 p-0',
      }"
    >
      <UButton 
        icon="i-lucide-bell" 
        variant="link" 
        @click="fetchUnreadMessages" 
      />
      
      <template #title>
        <div class="flex items-center">
          <UIcon name="i-lucide-bell" class="text-secondary mr-2" />
          <p>Notifications</p>
        </div>
      </template>

      <template #body>
        <OrganismsDashboardNotificationList 
          :messages="unreadMessages" 
          @select="$emit('open-conversation', $event)" 
        />
      </template>
    </USlideover>
  </UChip>
</template>

<script setup lang="ts">
const { aggregates, unreadMessages, fetchUnreadMessages } = useNotifications();

defineEmits<{
  (e: 'open-conversation', conversationId: number): void;
}>();

onMounted(() => {
  if (aggregates.value.unreadMessages > 0) {
    fetchUnreadMessages();
  }
});
</script>
