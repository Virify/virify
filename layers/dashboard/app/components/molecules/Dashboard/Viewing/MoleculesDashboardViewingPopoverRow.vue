<template>
  <div class="flex flex-col gap-1 border border-accented/40 rounded-md p-2">
    <!-- Date summary + status badge -->
    <div class="flex items-center justify-between gap-2">
      <span class="body-xs font-semibold">{{ dateLabel }}</span>
      <UBadge :color="statusColor" size="md" variant="subtle">{{ statusLabel }}</UBadge>
    </div>

    <!-- Time preferences -->
    <span v-if="viewing.preferredTimes.length" class="body-xs text-muted-foreground">
      {{ viewing.preferredTimes.join(", ") }}
    </span>

    <!-- Owner: confirmed time as plain text -->
    <span v-if="isOwner && viewing.counterProposedAt" class="body-xs text-muted-foreground">
      {{ confirmedLabel }}: {{ formatViewingDate(viewing.counterProposedAt) }}
    </span>

    <!-- Buyer: confirmed/proposed time as a badge -->
    <UBadge
      v-if="!isOwner && viewing.counterProposedAt"
      icon="i-lucide-check"
      class="body-xs text-white"
    >
      {{ confirmedLabel }}: {{ formatViewingDate(viewing.counterProposedAt) }}
    </UBadge>

    <!-- Notes -->
    <span v-if="viewing.notes" class="body-xs text-muted-foreground italic truncate">
      Note: {{ viewing.notes }}
    </span>

    <!-- Buyer: inline actions when owner has proposed a new time -->
    <div
      v-if="!isOwner && viewing.status === 'RESCHEDULED'"
      class="flex gap-1 flex-wrap mt-1 pt-1 border-t border-accented/20"
    >
      <UButton size="xs" color="success" variant="subtle" icon="i-lucide-check" class="body-sm" @click="$emit('acceptCounter', viewing.id)">
        Accept time
      </UButton>
      <UButton size="xs" color="secondary" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('manage')">
        Suggest new times
      </UButton>
    </div>

    <!-- Calendar export menu for all other states -->
    <AtomsViewingCalendarMenu v-else :viewing="viewing" class="mt-1" />
  </div>
</template>

<script setup lang="ts">
import type { ViewingWithDetails } from "~~/shared/types/viewing";

const props = defineProps<{
  viewing: ViewingWithDetails;
  isOwner: boolean;
}>();

defineEmits<{
  (e: "acceptCounter", id: number): void;
  (e: "manage"): void;
}>();

const dateLabel = computed(() =>
  props.viewing.proposedDates.length === 1
    ? formatViewingDate(props.viewing.proposedDates[0]!)
    : `${props.viewing.proposedDates.length} dates`,
);

const statusColor = computed(
  () => VIEWING_STATUS_COLOR[props.viewing.status as keyof typeof VIEWING_STATUS_COLOR] ?? "neutral",
);

const statusLabel = computed(
  () => VIEWING_STATUS_LABEL[props.viewing.status as keyof typeof VIEWING_STATUS_LABEL] ?? props.viewing.status,
);

const confirmedLabel = computed(() =>
  props.viewing.status === "ACCEPTED" ? "Confirmed" : "Proposed",
);
</script>
