<template>
  <UPopover
    v-model:open="viewingPopoverOpen"
    :ui="{ content: 'p-4 w-[calc(100vw-2rem)] sm:w-80' }"
  >
    <UButton
      icon="i-lucide-calendar-plus"
      variant="solid"
      size="sm"
      :ui="{ leadingIcon: 'text-white' }"
      aria-label="Request a viewing"
    />
    <template #content>
      <div class="flex flex-col gap-3">
        <!-- Owner: show existing viewings for this conversation -->
        <template v-if="isOwner">
          <h3 class="body-sm font-semibold flex items-center gap-2">
            <UIcon name="i-lucide-calendar" class="text-secondary size-5" color="secondary" />
            Scheduled Viewings
          </h3>
          <div v-if="conversationViewings.length" class="flex flex-col gap-2">
            <div
              v-for="v in conversationViewings"
              :key="v.id"
              class="flex flex-col gap-1 border border-accented/40 rounded-md p-2"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="body-xs font-semibold">{{ formatViewingDate(v.proposedAt) }}</span>
                <UBadge :color="viewingStatusColor(v.status)" size="md" variant="subtle">
                  {{ v.status }}
                </UBadge>
              </div>
              <span v-if="v.counterProposedAt" class="body-xs text-muted-foreground">
                Counter: {{ formatViewingDate(v.counterProposedAt) }}
              </span>
              <span v-if="v.notes" class="body-xs text-muted-foreground italic truncate">
                Note: {{ v.notes }}
              </span>
              <AtomsViewingCalendarMenu :viewing="v" class="mt-1" />
            </div>
            <UButton
              icon="i-lucide-calendar-days"
              size="sm"
              variant="outline"
              class="w-full cursor-pointer body-sm"
              @click="navigateTo('/dashboard/viewings')"
            >
              Manage Viewings
            </UButton>
          </div>
          <p v-else class="body-sm text-muted-foreground">
            No viewings scheduled for this conversation.
          </p>
        </template>
        <!-- Buyer: show existing viewings if any, then request form -->
        <template v-else>
          <template v-if="conversationViewings.length">
            <h3 class="body-sm font-semibold flex items-center gap-2">
              <UIcon name="i-lucide-calendar" class="text-secondary size-5" color="secondary" />
              Scheduled Viewings
            </h3>
            <div class="flex flex-col gap-2">
              <div
                v-for="v in conversationViewings"
                :key="v.id"
                class="flex flex-col gap-1 border border-accented/40 rounded-md p-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="body-xs font-semibold">{{ formatViewingDate(v.proposedAt) }}</span>
                  <UBadge :color="viewingStatusColor(v.status)" size="md" variant="subtle">
                    {{ v.status }}
                  </UBadge>
                </div>
                <span v-if="v.counterProposedAt" class="body-xs text-muted-foreground">
                  Counter: {{ formatViewingDate(v.counterProposedAt) }}
                </span>
                <span v-if="v.notes" class="body-xs text-muted-foreground italic truncate">
                  Note: {{ v.notes }}
                </span>
                <AtomsViewingCalendarMenu :viewing="v" class="mt-1" />
              </div>
              <UButton
                icon="i-lucide-calendar-days"
                size="sm"
                variant="solid"
                class="w-full cursor-pointer body-sm"
                @click="navigateTo('/dashboard/viewings')"
              >
                Manage Viewings
              </UButton>
            </div>
          </template>
          <template v-else>
            <h3 class="body-sm font-semibold">Request a Viewing</h3>
            <UCalendar
              :model-value="(viewingDate as any)"
              :min-value="(viewingToday as any)"
              class="mx-auto"
              :ui="{ headCell: 'text-secondary!' }"
              @update:model-value="viewingDate = $event as DateValue"
            />
            <UFormField label="Time">
              <UInput v-model="viewingTime" type="time" class="w-full" />
            </UFormField>
            <UFormField label="Notes (optional)">
              <UTextarea
                v-model="viewingNotes"
                placeholder="Any additional notes..."
                :rows="2"
                class="w-full"
              />
            </UFormField>
            <UButton
              :disabled="!viewingDate || !viewingTime"
              :loading="viewingSubmitting"
              icon="i-lucide-calendar-check"
              size="sm"
              variant="solid"
              :ui="{ base: 'text-white!' }"
              class="bg-(--blue-300) cursor-pointer body-sm"
              @click="submitViewingRequest"
            >
              Request Viewing
            </UButton>
          </template>
        </template>
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
  viewingToday,
  viewingPopoverOpen,
  viewingDate,
  viewingTime,
  viewingNotes,
  viewingSubmitting,
  conversationViewings,
  formatViewingDate,
  viewingStatusColor,
  submitViewingRequest,
} = useViewingRequest(
  () => props.conversation,
  () => props.isOwner,
);
</script>
