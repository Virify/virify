<template>
  <UPageCard
    variant="outline"
    :ui="{
      root: 'cursor-pointer gap-2! h-full',
      header: 'body-sm w-full flex justify-between items-center mb-2',
      body: 'w-full flex-1',
      container: 'p-4!',
    }"
    @click="$emit('click')"
  >
    <template #header>
      <div>
        <UAvatar
          :name="enquiry.sender?.username || 'User'"
          :alt="enquiry.sender.username!"
          size="sm"
          class="mr-2"
        />
        <p class="inline font-bold">{{ enquiry.sender?.username || 'User' }}</p>
      </div>
      <p class="self-end">{{ formatMessageTimestamp(enquiry.updatedAt) }}</p>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 w-full h-full">
        <!-- Column 1: Listing Card -->
        <OrganismsDashboardListingCardEnquiry 
          :listing="enquiry.listing" 
        />

        <!-- Column 2: Last Message and Reply Button -->
        <OrganismsDashboardEnquiryMessageSummary
          class="flex-1"
          :enquiry="enquiry"
          :user="user"
          @reply="$emit('reply', $event)"
        />
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
defineProps<{
  enquiry: any, // ConversationWithUserAndMessages
  user: any
}>()

defineEmits<{
  (e: 'click'): void
  (e: 'reply', enquiry: any): void
}>()
</script>