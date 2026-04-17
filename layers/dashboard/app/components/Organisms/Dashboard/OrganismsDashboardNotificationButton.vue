<template>
  <UChip inset color="error" :show="(notificationCounts?.total ?? 0) > 0" class="relative">
    <USlideover 
      description="Your notifications"
      :ui="{
        body: 'sm:p-0 p-0',
      }"
      v-model:open="isOpen"
    >
      <UButton 
        icon="i-lucide-bell" 
        variant="link" 
        size="md"
        :ui="{
          leadingIcon: 'text-' + color,
        }"
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
          @select="handleNotificationSelect($event)" 
          @loadMore="loadMoreNotifications()"
        />
      </template>
    </USlideover>
  </UChip>
</template>

<script setup lang="ts">
const { aggregates, notificationCounts, unreadNotifications, fetchNotifications, loadMoreNotifications, notificationHasMore, notificationsLoading, markAsRead } = useNotifications();
const { openConversation } = useGlobalEnquiryModal();
const { enquiries } = useEnquiries();

const props = withDefaults(defineProps<{
  color?: string;
  open?: boolean;
}>(), {
  color: 'foreground',
  open: undefined,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

// Internal state for standalone usage
const internalOpen = ref(false);

// Use external state if provided, otherwise use internal state
const isOpen = computed({
  get: () => props.open !== undefined ? props.open : internalOpen.value,
  set: (value) => {
    if (props.open !== undefined) {
      emit('update:open', value);
    } else {
      internalOpen.value = value;
    }
  }
});

const hasFetchedOnce = ref(false);

// Map notification type to the correct viewings tab
function viewingTabForType(type: string): string {
  if (type === 'VIEWING_REQUEST') return 'requested';
  if (type === 'VIEWING_RESCHEDULED') return 'rescheduled';
  if (type === 'VIEWING_ACCEPTED') return 'confirmed';
  return 'all';
}

// Route based on notification type
async function handleNotificationSelect(notification: UserNotification) {
  // Close slideover first so it doesn't block the modal on mobile
  isOpen.value = false;

  // Wait for the slideover close animation to finish before opening anything else
  await nextTick();

  if ((notification.type as string)?.startsWith('VIEWING_')) {
    markAsRead({ notificationId: notification.id });
    navigateTo(`/dashboard/viewings?tab=${viewingTabForType(notification.type as string)}`);
    return;
  }

  if (notification.conversationId) {
    const conversation = enquiries.value.find(e => e.id === notification.conversationId);
    openConversation(conversation || notification.conversationId);
  } else if (notification.listingId) {
    navigateTo(`/listing/${notification.listingId}`);
  }
}

// Fetch notifications when unread count becomes available OR slideover opens (whichever comes first)
const shouldFetchNotifications = computed(() => {
  const hasUnread = aggregates.value.unreadMessages > 0;
  const isSlideoverOpen = isOpen.value;
  return (hasUnread || isSlideoverOpen) && !hasFetchedOnce.value;
});

// Only watch on client to prevent SSR hydration issues
if (import.meta.client) {
  watch(shouldFetchNotifications, (shouldFetch) => {
    if (shouldFetch) {
      fetchNotifications();
      hasFetchedOnce.value = true;
    }
  }, { immediate: true });

  // When the panel opens, always do a force-refresh so that notifications
  // created while the WebSocket was offline are shown immediately.
  watch(isOpen, (open) => {
    if (open) {
      fetchNotifications({ force: true });
    }
  });
}
</script>
