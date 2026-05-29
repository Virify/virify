<template>
  <UPageCard
    variant="subtle"
    :class="{ 'opacity-60': isCancelledOrRejected }"
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
            <p class="font-bold body-sm leading-tight truncate">
              {{ otherUser.username || "User" }}
            </p>
            <p class="body-xs text-(--foreground-200) mt-0.5">
              {{ formatMessageTimestamp(viewing.createdAt) }}
            </p>
          </div>
        </div>
        <!-- Status badge -->
        <UBadge
          :color="statusColor"
          variant="subtle"
          size="md"
          class="shrink-0 mt-0.5"
        >
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
          <UIcon
            name="i-lucide-map-pin"
            class="size-4 text-secondary shrink-0 mt-0.5"
          />
          <p
            class="body-xs text-(--foreground-100) leading-snug group-hover:text-secondary group-hover:underline transition-colors"
          >
            {{ address }}
          </p>
        </NuxtLink>

        <!-- Proposed dates (hidden once confirmed or cancelled) -->
        <div v-if="showProposedDates" class="flex flex-col gap-0.5">
          <div
            v-for="date in formattedDates"
            :key="date"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-calendar"
              class="size-4 text-secondary shrink-0"
            />
            <p class="body-xs">{{ date }}</p>
          </div>
          <div
            v-if="viewing.preferredTimes.length"
            class="flex flex-wrap gap-1 mt-1"
          >
            <UBadge
              v-for="pref in viewing.preferredTimes"
              :key="pref"
              color="neutral"
              variant="subtle"
              size="md"
              >{{ pref }}</UBadge
            >
          </div>
        </div>

        <!-- Confirmed / proposed time badge -->
        <UBadge
          v-if="viewing.counterProposedAt"
          icon="i-lucide-check"
          class="body-xs text-(--foreground-200)"
          color="success"
          variant="subtle"
          size="md"
        >
          {{ counterDateLabel }}: {{ formatCounterDate }}
        </UBadge>

        <!-- Notes -->
        <div v-if="viewing.notes" class="flex items-start gap-2">
          <UIcon
            name="i-lucide-message-square"
            class="size-4 text-(--foreground-200) shrink-0 mt-0.5"
          />
          <p class="body-sm text-(--foreground-200) line-clamp-2 italic">
            {{ viewing.notes }}
          </p>
        </div>

        <!-- Action buttons -->
        <MoleculesDashboardViewingCardActions
          v-if="isActionable"
          :viewing="viewing"
          :is-owner="isOwner"
          :status="viewing.status"
          class="pt-2.5 border-t border-accented/30 mt-0.5"
          @accept="$emit('accept', $event)"
          @reject="$emit('reject', $event)"
          @reschedule="$emit('reschedule', $event)"
          @cancel="$emit('cancel', $event)"
          @accept-counter="$emit('acceptCounter', $event)"
          @counter-propose="$emit('counterPropose', $event)"
        />
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
  (e: "counterPropose", viewing: ViewingWithDetails): void;
}>();

const isOwner = computed(() => props.viewing.ownerId === props.currentUserId);

const otherUser = computed(() =>
  isOwner.value ? props.viewing.requester : props.viewing.owner,
);

const address = computed(
  () => props.viewing.listing?.property?.address?.fullAddress ?? null,
);

const showProposedDates = computed(() => !props.viewing.counterProposedAt);

const isActionable = computed(
  () =>
    props.viewing.status === "PENDING" ||
    props.viewing.status === "ACCEPTED" ||
    props.viewing.status === "RESCHEDULED",
);

const formattedDates = computed(() =>
  props.viewing.proposedDates.map((d) => formatViewingDate(d)),
);

const formatCounterDate = computed(() =>
  props.viewing.counterProposedAt
    ? formatViewingDateTime(props.viewing.counterProposedAt)
    : null,
);

const counterDateLabel = computed(() =>
  props.viewing.status === "RESCHEDULED" ? "Proposed time" : "Confirmed time",
);

const statusColor = computed(
  () => VIEWING_STATUS_COLOR[props.viewing.status] ?? "neutral",
);

const statusLabel = computed(
  () => VIEWING_STATUS_LABEL[props.viewing.status] ?? props.viewing.status,
);

const isCancelledOrRejected = computed(
  () =>
    props.viewing.status === "CANCELLED" || props.viewing.status === "REJECTED",
);
</script>
