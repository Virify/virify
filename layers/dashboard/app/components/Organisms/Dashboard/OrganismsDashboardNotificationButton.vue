<template>
  <UChip inset color="error" :show="aggregates.unreadMessages > 0" class="relative">
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
          @select="handleSelectConversation($event)" 
          @loadMore="loadMoreNotifications()"
        />
      </template>
    </USlideover>
  </UChip>
</template>

<script setup lang="ts">
const { aggregates, unreadNotifications, fetchNotifications, loadMoreNotifications, notificationHasMore, notificationsLoading } = useNotifications();
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

// Open conversation modal
function handleSelectConversation(conversationId: number) {
  // Try to find conversation in already-loaded enquiries first
  const conversation = enquiries.value.find(e => e.id === conversationId);
  
  // Open modal with conversation object if available, otherwise just the ID
  openConversation(conversation || conversationId);
  
  // Keep slideover open for convenience - user can browse multiple notifications
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
}
</script>
