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
          @select="openConversation($event)" 
          @loadMore="loadMoreNotifications()"
        />
      </template>
    </USlideover>
  </UChip>
</template>

<script setup lang="ts">
const { aggregates, unreadNotifications, fetchNotifications, loadMoreNotifications, notificationHasMore, notificationsLoading } = useNotifications();
const { openConversation } = useGlobalEnquiryModal();

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

// Fetch notifications once when unread count becomes available
watch(() => aggregates.value.unreadMessages, (count) => {
  if (count > 0 && !hasFetchedOnce.value) {
    fetchNotifications();
    hasFetchedOnce.value = true;
  }
}, { immediate: true });
</script>
