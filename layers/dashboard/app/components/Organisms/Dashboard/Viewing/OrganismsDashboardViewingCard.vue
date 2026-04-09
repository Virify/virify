<template>
  <UPageCard
    variant="subtle"
    :ui="{
      root: 'gap-0! bg-elevated border border-accented/50 hover:border-accented transition-colors duration-200',
      header: 'w-full mb-0 pb-3 border-b border-accented/30',
      body: 'w-full pt-3',
      container: 'p-4!',
    }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-3 w-full">
        <!-- Avatar + name + date -->
        <div class="flex items-center gap-2.5 min-w-0">
          <UAvatar
            :src="otherUser.avatar || undefined"
            :alt="otherUser.username || 'User'"
            size="md"
            class="text-(--foreground-100) bg-(--background-200) shrink-0"
          />
          <div class="min-w-0">
            <p class="font-bold body-sm leading-tight truncate">{{ otherUser.username || 'User' }}</p>
            <p class="body-xs text-(--foreground-200) mt-0.5">{{ formatMessageTimestamp(viewing.createdAt) }}</p>
          </div>
        </div>
        <!-- Status badge -->
        <UBadge :color="statusColor" variant="subtle" size="md" class="shrink-0 mt-0.5">
          {{ statusLabel }}
        </UBadge>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-2.5">
        <!-- Address -->
        <NuxtLink
          v-if="address"
          :to="`/listing/${viewing.listingId}`"
          target="_blank"
          class="flex items-start gap-2 group"
        >
          <UIcon name="i-lucide-map-pin" class="size-4 text-secondary shrink-0 mt-0.5" />
          <p class="body-xs text-(--foreground-100) leading-snug group-hover:text-secondary group-hover:underline transition-colors">{{ address }}</p>
        </NuxtLink>

        <!-- Proposed date/time -->
        <div class="flex items-start gap-2">
          <UIcon name="i-lucide-calendar" class="size-4 text-secondary shrink-0 mt-0.5" />
          <div>
            <p class="body-xs">{{ formattedDate }}</p>
            <p v-if="viewing.counterProposedAt" class="body-xs text-(--foreground-200) mt-0.5">
              New proposal: {{ formatCounterDate }}
            </p>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="viewing.notes" class="flex items-start gap-2">
          <UIcon name="i-lucide-message-square" class="size-4 text-(--foreground-200) shrink-0 mt-0.5" />
          <p class="body-sm text-(--foreground-200) line-clamp-2 italic">{{ viewing.notes }}</p>
        </div>

        <!-- Actions -->
        <div
          v-if="viewing.status === 'PENDING' || viewing.status === 'ACCEPTED' || viewing.status === 'RESCHEDULED'"
          class="flex gap-2 flex-wrap pt-2.5 border-t border-accented/30 mt-0.5"
        >
          <AtomsViewingCalendarMenu :viewing="viewing" />
          <!-- Owner actions on PENDING -->
          <template v-if="isOwner && viewing.status === 'PENDING'">
            <UButton size="xs" color="success" variant="subtle" icon="i-lucide-check" class="body-sm" @click="$emit('accept', viewing.id)">Accept</UButton>
            <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('reject', viewing.id)">Decline</UButton>
            <UButton size="xs" color="neutral" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('reschedule', viewing)">Reschedule</UButton>
          </template>

          <!-- Owner: cancel an already accepted or rescheduled viewing -->
          <template v-if="isOwner && (viewing.status === 'ACCEPTED' || viewing.status === 'RESCHEDULED')">
            <UButton size="xs" color="error" variant="subtle" icon="i-lucide-calendar-x" class="body-sm" @click="$emit('cancel', viewing.id)">Cancel viewing</UButton>
          </template>

          <!-- Requester: cancel PENDING or ACCEPTED viewing -->
          <template v-if="!isOwner && (viewing.status === 'PENDING' || viewing.status === 'ACCEPTED')">
            <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('cancel', viewing.id)">Cancel</UButton>
          </template>

          <!-- Requester: accept/decline counter-proposal -->
          <template v-if="!isOwner && viewing.status === 'RESCHEDULED'">
            <UButton size="xs" color="success" variant="subtle" icon="i-lucide-check" class="body-sm" @click="$emit('acceptCounter', viewing.id)">Accept new time</UButton>
            <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('cancel', viewing.id)">Decline</UButton>
          </template>
        </div>
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
import type { ViewingWithDetails } from "~~/shared/types/viewing";

const props = defineProps<{
  viewing: ViewingWithDetails;
  currentUserId: number;
}>();

defineEmits<{
  (e: "accept", id: number): void;
  (e: "reject", id: number): void;
  (e: "reschedule", viewing: ViewingWithDetails): void;
  (e: "cancel", id: number): void;
  (e: "acceptCounter", id: number): void;
}>();

const isOwner = computed(() => props.viewing.ownerId === props.currentUserId);

const otherUser = computed(() =>
  isOwner.value ? props.viewing.requester : props.viewing.owner,
);

const address = computed(
  () => props.viewing.listing?.property?.address?.fullAddress ?? null,
);

const formattedDate = computed(() =>
  new Date(props.viewing.proposedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }),
);

const formatCounterDate = computed(() =>
  props.viewing.counterProposedAt
    ? new Date(props.viewing.counterProposedAt).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : null,
);

const statusColor = computed(() => {
  const map: Record<string, "success" | "error" | "warning" | "neutral" | "info"> = {
    PENDING: "warning",
    ACCEPTED: "success",
    REJECTED: "error",
    RESCHEDULED: "info",
    CANCELLED: "neutral",
  };
  return map[props.viewing.status] ?? "neutral";
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    PENDING: "Pending",
    ACCEPTED: "Confirmed",
    REJECTED: "Declined",
    RESCHEDULED: "Time proposed",
    CANCELLED: "Cancelled",
  };
  return map[props.viewing.status] ?? props.viewing.status;
});
</script>
