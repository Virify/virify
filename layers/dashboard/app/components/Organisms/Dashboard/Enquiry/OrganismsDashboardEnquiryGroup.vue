<template>
  <UPageCard
    variant="subtle"
    :to="`/dashboard/enquiries/${group.listing?.id}`"
    :ui="{
      root: 'cursor-pointer gap-2! h-full bg-elevated transition-colors duration-150 group',
      header: 'body-sm w-full flex justify-between items-center mb-2',
      body: 'w-full flex-1 transition-colors duration-150',
      container: 'p-4!',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-2 w-full h-full">
        <!-- Listing Card -->
        <OrganismsDashboardListingCardEnquiry v-if="group.listing" :listing="group.listing" />

        <!-- Summary Stats -->
        <div class="flex flex-wrap items-center gap-2 py-2">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-circle" class="w-2.5 h-2.5" :class="unreadConversations.length > 0 ? 'text-secondary fill-secondary' : 'text-gray-300 fill-gray-300'" />
            <span class="body-xs" :class="unreadConversations.length > 0 ? 'text-secondary body-xs' : 'text-(--foreground-200)'"> {{ unreadConversations.length }} Unread </span>
          </div>

          <USeparator orientation="vertical" class="h-4" />
          <span class="body-xs text-(--foreground-200)"> {{ readConversations.length }} Read </span>
          <USeparator orientation="horizontal" class="h-4" />
          <div class="flex items-center justify-between w-full">
            <span class="body-xs text-(--foreground-200)"> {{ group.conversations.length }} Total Enquiries </span>

            <UButton
              variant="solid"
              size="sm"
              color="secondary"
              label="View All"
              class="body-sm"
              trailing-icon="i-lucide-arrow-right"
              :to="`/dashboard/enquiries/${group.listing?.id}`"
              :ui="{
                trailingIcon: 'group-hover:translate-x-1 transition-transform text-white',
                label: 'text-white',
              }"
            />
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";
import type { ConversationWithUserAndMessages } from "~~/shared/types/conversation";
import { getUnreadCount } from "~/utils/conversation";

// Define input prop for the group
interface EnquiryGroup {
  listing: any;
  conversations: ConversationWithUserAndMessages[];
}

const props = defineProps<{
  group: EnquiryGroup;
  user: User | null;
}>();

defineEmits<{
  (e: "click", listingId?: number): void;
}>();

const unreadConversations = computed(() => {
  return props.group.conversations.filter((c) => getUnreadCount(c, props.user?.id) > 0);
});

const readConversations = computed(() => {
  return props.group.conversations.filter((c) => getUnreadCount(c, props.user?.id) === 0);
});
</script>
