<template>
  <UPageCard
    variant="subtle"
    :ui="{
      root: 'cursor-pointer gap-2! h-full bg-elevated transition-colors duration-150',
      header: 'body-sm w-full flex justify-between items-center mb-2',
      body: 'w-full flex-1 transition-colors duration-150',
      container: 'p-4!',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-4 w-full h-full">
        <!-- Listing Card -->
        <OrganismsDashboardListingCardEnquiry v-if="listing" :listing="listing" />
        <div v-else class="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center">General / Unknown Listing</div>

        <!-- Enquiries List -->
        <div class="flex flex-col gap-4 mt-2">
          <!-- Unread Section -->
          <div v-if="unreadConversations?.length > 0" class="flex flex-col gap-2">
            <h4 class="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-secondary"></div>
              Unread ({{ unreadConversations?.length || 0 }})
            </h4>
            <div
              v-for="enquiry in unreadConversations"
              :key="enquiry.id"
              class="flex flex-col gap-3 p-3 rounded-lg bg-(--background-100) border border-secondary/20 hover:border-secondary transition-colors cursor-pointer"
              @click.stop="$emit('click', enquiry)"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UAvatar :name="enquiry.sender?.username || 'User'" :alt="enquiry.sender?.username || 'User'" size="xs" class="bg-(--background-200) text-(--foreground-100)" />
                  <span class="text-sm font-bold text-(--foreground-100)">
                    {{ enquiry.sender?.username || "User" }}
                  </span>
                </div>
                <span class="text-xs text-(--foreground-200)">
                  {{ formatMessageTimestamp(enquiry.updatedAt) }}
                </span>
              </div>
              <OrganismsDashboardEnquiryMessageSummary :enquiry="enquiry" :user="user" @reply="$emit('reply', enquiry)" />
            </div>
          </div>

          <!-- Read Section -->
          <div v-if="readConversations?.length > 0" class="flex flex-col gap-2">
            <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider dark:text-gray-500 mt-2">Start a chat ({{ readConversations?.length || 0 }})</h4>
            <div
              v-for="enquiry in readConversations"
              :key="enquiry.id"
              class="flex flex-col gap-3 p-3 rounded-lg bg-(--background-100) border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer"
              @click.stop="$emit('click', enquiry)"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UAvatar :name="enquiry.sender?.username || 'User'" :alt="enquiry.sender?.username || 'User'" size="xs" class="bg-(--background-200) text-(--foreground-100)" />
                  <span class="text-sm font-bold text-(--foreground-100)">
                    {{ enquiry.sender?.username || "User" }}
                  </span>
                </div>
                <span class="text-xs text-(--foreground-200)">
                  {{ formatMessageTimestamp(enquiry.updatedAt) }}
                </span>
              </div>

              <OrganismsDashboardEnquiryMessageSummary :enquiry="enquiry" :user="user" @reply="$emit('reply', enquiry)" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
  import type { User } from '#auth-utils'
  import type { ConversationWithMinimalListing } from '~~/shared/types/conversation'
  import { getUnreadCount } from '~/utils/conversation'

  // This component now takes a LIST of conversations and a LISTING directly
  const props = defineProps<{
    listing: any;
    conversations: ConversationWithMinimalListing[];
    user: User | null;
  }>()

  defineEmits<{
    (e: 'click', enquiry: ConversationWithMinimalListing): void
    (e: 'reply', enquiry: ConversationWithMinimalListing): void
  }>()

  const unreadConversations = computed(() => {
     return (props.conversations || []).filter(c => getUnreadCount(c, props.user?.id) > 0);
  });
  
  const readConversations = computed(() => {
     return (props.conversations || []).filter(c => getUnreadCount(c, props.user?.id) === 0);
  });
</script>
