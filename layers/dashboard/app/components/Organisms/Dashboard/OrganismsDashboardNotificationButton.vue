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
        size="md"
        :ui="{
          leadingIcon: 'text-' + color,
        }"
        @click="handleClick"
      />
      
      <template #title>
        <div class="flex items-center">
          <UIcon name="i-lucide-bell" class="mr-2" />
          <p>Notifications</p>
        </div>
      </template>

      <template #body>
        <OrganismsDashboardNotificationList 
          :notifications="unreadNotifications" 
          :hasMore="notificationHasMore"
          :loading="notificationsLoading"
          @select="openConversation($event)" 
          @loadMore="loadMoreNotifications()"
        />
      </template>
    </USlideover>
  </UChip>
</template>

<script setup lang="ts">
const { aggregates, unreadNotifications, fetchNotifications, loadMoreNotifications, notificationHasMore, notificationsLoading, resetNotifications } = useNotifications();
const { openConversation } = useGlobalEnquiryModal();

withDefaults(defineProps<{
  color?: string;
}>(), {
  color: 'foreground',
});

function handleClick() {
  resetNotifications();
  fetchNotifications();
}

onMounted(() => {
  if (aggregates.value.unreadMessages > 0) {
    fetchNotifications();
  }
});
</script>
