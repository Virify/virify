<template>
  <div class="flex gap-2 flex-wrap">
    <AtomsViewingCalendarMenu :viewing="viewing" />

    <!-- Owner: confirm / decline / reschedule on PENDING -->
    <template v-if="isOwner && status === 'PENDING'">
      <UButton size="xs" color="success" variant="subtle" icon="i-lucide-check" class="body-sm" @click="$emit('accept', viewing.id)">
        Confirm time
      </UButton>
      <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('reject', viewing.id)">
        Decline
      </UButton>
      <UButton size="xs" color="neutral" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('reschedule', viewing)">
        Reschedule
      </UButton>
    </template>

    <!-- Owner: reschedule / cancel on ACCEPTED or RESCHEDULED -->
    <template v-if="isOwner && (status === 'ACCEPTED' || status === 'RESCHEDULED')">
      <UButton size="xs" color="neutral" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('reschedule', viewing)">
        Reschedule
      </UButton>
      <UButton size="xs" color="error" variant="subtle" icon="i-lucide-calendar-x" class="body-sm" @click="$emit('cancel', viewing.id)">
        Cancel viewing
      </UButton>
    </template>

    <!-- Requester: cancel on PENDING -->
    <template v-if="!isOwner && status === 'PENDING'">
      <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('cancel', viewing.id)">
        Cancel
      </UButton>
    </template>

    <!-- Requester: accept owner's time or suggest new times on RESCHEDULED -->
    <template v-if="!isOwner && status === 'RESCHEDULED'">
      <UButton size="xs" color="success" variant="subtle" icon="i-lucide-check" class="body-sm" @click="$emit('acceptCounter', viewing.id)">
        Accept time
      </UButton>
      <UButton size="xs" color="secondary" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('counterPropose', viewing)">
        Suggest new times
      </UButton>
      <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('cancel', viewing.id)">
        Cancel
      </UButton>
    </template>

    <!-- Requester: reschedule or cancel on ACCEPTED -->
    <template v-if="!isOwner && status === 'ACCEPTED'">
      <UButton size="xs" color="secondary" variant="subtle" icon="i-lucide-calendar-clock" class="body-sm" @click="$emit('counterPropose', viewing)">
        Reschedule
      </UButton>
      <UButton size="xs" color="error" variant="subtle" icon="i-lucide-x" class="body-sm" @click="$emit('cancel', viewing.id)">
        Cancel
      </UButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ViewingStatus, ViewingWithDetails } from "~~/shared/types/viewing";

defineProps<{
  viewing: ViewingWithDetails;
  isOwner: boolean;
  status: ViewingStatus;
}>();

defineEmits<{
  (e: "accept", id: number): void;
  (e: "reject", id: number): void;
  (e: "reschedule", viewing: ViewingWithDetails): void;
  (e: "cancel", id: number): void;
  (e: "acceptCounter", id: number): void;
  (e: "counterPropose", viewing: ViewingWithDetails): void;
}>();
</script>
