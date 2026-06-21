<template>
  <div
    v-if="notifications.length === 0"
    class="flex flex-col items-center justify-center p-8 text-center"
  >
    <UIcon
      name="i-lucide-bell-off"
      class="w-8 h-8 mb-2 opacity-50"
    />
    <p class="text-sm">No new notifications</p>
  </div>
  <div
    v-else
    class="space-y-0"
  >
    <UCard
      v-for="notification in notifications"
      :key="notification.id"
      @click="handleSelect(notification)"
      :ui="{
        root: 'cursor-pointer transition-colors rounded-0! hover:bg-elevated/80 m-3 bg-elevated',
        header: 'flex items-center justify-between sm:p-2 p-2 gap-2 body-sm font-bold',
        body: 'flex items-center justify-start gap-2 border-0 sm:p-2 p-2 text-sm',
        footer: 'sm:p-2 p-2 sm:pt-1 pt-1',
      }"
    >
      <template #header>
        <h3>{{ notification.title }}</h3>
        <UButton
          size="sm"
          variant="ghost"
          color="primary"
          class=""
          icon="i-lucide-x"
          @click.stop="handleDismiss(notification.id)"
        />
      </template>
      <template #default>
        <UAvatar
          :src="notification.senderAvatar || undefined"
          :alt="notification.senderUsername || 'Virify'"
          size="sm"
          :ui="{
            root: 'border border-(--foreground-100)',
          }"
        />
        <p class="font-bold truncate mt-0.5!">
          {{ notification.senderUsername || "Virify" }}
        </p>
      </template>
      <template #footer>
        <p class="text-xs line-clamp-3">
          {{ notification.message }}
        </p>
        <!-- Minimal listing info if available -->
        <div
          v-if="notification.listingAddress"
          class="flex items-center gap-1 mt-2 text-xs text-gray-500"
        >
          <UIcon
            name="i-lucide-home"
            class="w-3 h-3"
          />
          <span class="truncate">{{ notification.listingAddress }}</span>
        </div>
        <div class="flex justify-between items-center pt-2">
          <UTooltip text="Report message">
            <UButton
              size="md"
              variant="ghost"
              icon="i-lucide-triangle-alert"
              to="/support"
              target="_blank"
              @click.stop
              :ui="{
                leadingIcon: 'text-error',
              }"
            />
          </UTooltip>
          <p class="text-xs italic font-light flex-1 text-right pt-3">
            {{ formatMessageTimestamp(notification.createdAt) }}
          </p>
        </div>
      </template>
    </UCard>
    <!-- Infinite scroll sentinel -->
    <div
      ref="sentinel"
      class="h-4"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { useIntersectionObserver } from "@vueuse/core";

  const props = defineProps<{
    notifications: UserNotification[];
    hasMore?: boolean;
    loading?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "select", notification: UserNotification): void;
    (e: "loadMore"): void;
  }>();

  const { dismissNotification } = useNotifications();

  const sentinel = ref<HTMLElement | null>(null);
  const handleSelect = async (notification: UserNotification) => {
    emit("select", notification);
  };

  const handleDismiss = async (notificationId: number) => {
    await dismissNotification(notificationId);
  };

  const loadMore = () => emit("loadMore");

  // Trigger pagination when sentinel intersects
  const stopObserver =
    import.meta.client ?
      useIntersectionObserver(
        sentinel,
        ([entry]) => {
          if (entry?.isIntersecting && props.hasMore && !props.loading) {
            loadMore();
          }
        },
        { threshold: 0.1 },
      ).stop
    : null;

  onBeforeUnmount(() => {
    stopObserver?.();
  });
</script>
