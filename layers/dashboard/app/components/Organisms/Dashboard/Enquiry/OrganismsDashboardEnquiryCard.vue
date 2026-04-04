<template>
  <UPageCard variant="subtle" :ui="{
    root: 'cursor-pointer gap-2! h-full bg-elevated hover:bg-(--background-100) transition-colors duration-150',
    header: 'body-sm w-full flex justify-between items-center mb-2',
    body: 'w-full flex-1 transition-colors duration-150',
    container: 'p-4!',
  }" @click="$emit('click')">
    <template #header>
      <div class="text-(--foreground-200)">
        <UAvatar :src="enquiry.sender?.avatar || undefined" :name="enquiry.sender?.username || 'User'" :alt="enquiry.sender.username!" size="sm"
          class="mr-2 text-(--foreground-100) bg-(--background-200)" />
        <p class="inline font-bold">{{ enquiry.sender?.username || 'User' }}</p>
      </div>
      <p class="self-end text-(--foreground-200)">{{ formatMessageTimestamp(enquiry.updatedAt) }}</p>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 w-full h-full transition-colors duration-150">
        <!-- Column 1: Listing Card -->
        <OrganismsDashboardListingCardEnquiry :listing="enquiry.listing" />

        <!-- Column 2: Last Message and Reply Button -->
        <OrganismsDashboardEnquiryMessageSummary class="flex-1" :enquiry="enquiry" :user="user"
          @reply="$emit('reply', $event)" />
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
import type { User } from '#auth-utils'

defineProps<{
  enquiry: ConversationWithMinimalListing,
  user: User | null,
}>()

defineEmits<{
  (e: 'click'): void
  (e: 'reply', enquiry: any): void
}>()
</script>