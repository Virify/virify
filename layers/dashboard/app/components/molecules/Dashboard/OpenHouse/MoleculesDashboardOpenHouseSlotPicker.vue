<template>
  <div class="flex flex-col gap-2">
    <p class="body-sm font-semibold">
      {{ formatOpenHouseDate(session.date) }}
      <span class="text-muted-foreground font-normal">
        · {{ session.startTime }}–{{ session.endTime }}</span
      >
    </p>
    <div class="flex flex-wrap gap-1.5">
      <UButton
        v-for="slot in slots"
        :key="slot"
        size="xs"
        :variant="modelValue === slot ? 'solid' : 'outline'"
        color="secondary"
        :disabled="session.bookedSlots.includes(slot)"
        :class="{
          'opacity-40 cursor-not-allowed': session.bookedSlots.includes(slot),
          'text-white!': modelValue === slot,
        }"
        @click="select(slot)"
      >
        {{ slot.split("–")[0] }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OpenHouseSession } from "~~/shared/types/open-house";

const props = defineProps<{ session: OpenHouseSession }>();

const modelValue = defineModel<string | null>({ default: null });

const slots = computed(() =>
  generateSlots(
    props.session.startTime,
    props.session.endTime,
    props.session.slotMins,
  ),
);

function select(slot: string) {
  if (props.session.bookedSlots.includes(slot)) return;
  modelValue.value = modelValue.value === slot ? null : slot;
}
</script>
