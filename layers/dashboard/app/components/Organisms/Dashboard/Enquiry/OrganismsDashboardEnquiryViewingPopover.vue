<template>
  <UPopover v-model:open="viewingPopoverOpen" :ui="{ content: 'p-4 w-[calc(100vw-2rem)] sm:w-80' }">
    <UButton
      icon="i-lucide-calendar-plus"
      variant="solid"
      size="sm"
      :ui="{ leadingIcon: 'text-white' }"
      aria-label="Request a viewing"
    />

    <template #content>
      <div class="flex flex-col gap-3">
        <!-- Header (always for owner; only when viewings exist for buyer) -->
        <h3
          v-if="isOwner || conversationViewings.length"
          class="body-sm font-semibold flex items-center gap-2"
        >
          <UIcon name="i-lucide-calendar" class="text-secondary size-5" />
          Scheduled Viewings
        </h3>

        <!-- Existing viewings list -->
        <template v-if="conversationViewings.length">
          <div class="flex flex-col gap-2">
            <MoleculesDashboardViewingPopoverRow
              v-for="v in conversationViewings"
              :key="v.id"
              :viewing="v"
              :is-owner="isOwner"
              @accept-counter="acceptCounterViewing"
              @manage="navigateTo('/dashboard/viewings')"
            />
            <UButton
              icon="i-lucide-calendar-days"
              size="sm"
              variant="solid"
              class="w-full cursor-pointer body-sm"
              :class="{ 'text-white!': !isOwner }"
              @click="navigateTo('/dashboard/viewings')"
            >
              Manage Viewings
            </UButton>
          </div>
          <UDivider v-if="!isOwner && !activeConversationViewings.length" class="my-1" />
        </template>

        <!-- Owner: empty state -->
        <p v-else-if="isOwner" class="body-sm text-muted-foreground">
          No viewings scheduled for this conversation.
        </p>

        <!-- Buyer: new viewing request form (when no active viewing exists) -->
        <MoleculesDashboardViewingRequestForm
          v-if="!isOwner && !activeConversationViewings.length"
          v-model:dates="viewingDates"
          v-model:times="viewingTimes"
          v-model:other-time="viewingOtherTime"
          v-model:notes="viewingNotes"
          :title="conversationViewings.length ? 'Request a New Viewing' : 'Request a Viewing'"
          :loading="viewingSubmitting"
          @submit="submitViewingRequest"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";

const props = defineProps<{
  conversation: ConversationWithMinimalListing | null;
  isOwner: boolean;
}>();

const {
  viewingPopoverOpen,
  viewingDates,
  viewingTimes,
  viewingOtherTime,
  viewingNotes,
  viewingSubmitting,
  conversationViewings,
  activeConversationViewings,
  submitViewingRequest,
  acceptCounterViewing,
} = useViewingRequest(
  () => props.conversation,
  () => props.isOwner,
);
</script>
