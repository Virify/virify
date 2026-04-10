<template>
  <div class="flex flex-col gap-4">
    <!-- Single-date calendar restricted to requester's proposed dates -->
    <UCalendar
      :model-value="(modelValue as any)"
      :is-date-unavailable="isDateUnavailable"
      class="mx-auto"
      :ui="{ headCell: 'text-secondary!', cellTrigger: 'data-unavailable:text-secondary!' }"
      @update:model-value="modelValue = $event as DateValue"
    />

    <!-- Quick-pick buttons derived from the requester's time preferences -->
    <div v-if="timeRangeButtons.length" class="flex flex-col gap-1">
      <p class="body-xs text-(--foreground-200)">Pick a time (based on requester's preferences)</p>
      <div class="flex flex-wrap gap-1">
        <UButton
          v-for="btn in timeRangeButtons"
          :key="btn.label"
          size="xs"
          :variant="time === btn.time ? 'solid' : 'subtle'"
          color="secondary"
          class="body-xs cursor-pointer"
          @click="time = btn.time"
        >
          {{ btn.label }}
        </UButton>
      </div>
    </div>

    <!-- Manual time input -->
    <UFormField label="Time">
      <UInput v-model="time" type="time" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelValue = defineModel<any>({ required: true });
const time = defineModel<string>("time", { required: true });

defineProps<{
  isDateUnavailable: (date: DateValue) => boolean;
  timeRangeButtons: { label: string; time: string }[];
}>();
</script>
