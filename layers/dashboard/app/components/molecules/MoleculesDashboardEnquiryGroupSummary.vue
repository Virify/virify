<template>
  <div class="flex flex-wrap items-center gap-2 py-2">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-circle" class="w-2.5 h-2.5" :class="unreadCount > 0 ? 'text-secondary fill-secondary' : 'text-gray-300 fill-gray-300'" />
      <span class="body-xs" :class="unreadCount > 0 ? 'text-secondary body-xs' : 'text-(--foreground-200)'"> {{ unreadCount }} Unread </span>
    </div>

    <USeparator orientation="vertical" class="h-4" />
    <span class="body-xs text-(--foreground-200)"> {{ readCount }} Read </span>
    <USeparator orientation="horizontal" class="h-4" />
    <div class="flex items-center justify-between w-full">
      <span class="body-xs text-(--foreground-200)"> {{ totalCount }} Total Enquiries </span>

      <UButton
        v-if="listingId"
        variant="solid"
        size="sm"
        color="secondary"
        label="View All"
        class="body-sm"
        trailing-icon="i-lucide-arrow-right"
        :to="`/dashboard/enquiries/${listingId}`"
        :ui="{
          trailingIcon: 'group-hover:translate-x-1 transition-transform text-white',
          label: 'text-white',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";
import { getUnreadCount } from "~/utils/conversation";

const props = defineProps<{
  conversations: ConversationWithUserAndMessages[];
  listingId?: number;
  userId?: number;
}>();

const unreadCount = computed(() => {
  return props.conversations.filter((c) => getUnreadCount(c, props.userId) > 0).length;
});

const readCount = computed(() => {
  return props.conversations.filter((c) => getUnreadCount(c, props.userId) === 0).length;
});

const totalCount = computed(() => props.conversations.length);
</script>
