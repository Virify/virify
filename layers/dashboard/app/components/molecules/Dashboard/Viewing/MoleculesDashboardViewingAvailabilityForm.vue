<template>
  <div class="flex flex-col gap-4">
    <!-- Multi-date calendar -->
    <div class="w-fit mx-auto">
      <p class="body-xs text-(--foreground-200) mb-1">
        Select your available dates
        <span v-if="modelValue.length" class="text-secondary font-semibold ml-1">
          ({{ modelValue.length }} selected)
        </span>
      </p>
      <UCalendar
        :model-value="(modelValue as any)"
        :min-value="(today as any)"
        multiple
        class="mx-auto"
        :ui="{ headCell: 'text-secondary!', cellTrigger: 'data-unavailable:text-secondary!' }"
        @update:model-value="modelValue = $event as DateValue[]"
      />
    </div>

    <!-- Time preferences multi-select -->
    <UFormField label="Preferred times">
      <USelect
        v-model="times"
        :items="VIEWING_TIME_OPTIONS"
        multiple
        placeholder="Select time preferences..."
        class="w-full"
      />
    </UFormField>

    <!-- Freeform input when 'Other...' is selected -->
    <UFormField v-if="times.includes('Other...')" label="When are you available?">
      <UInput
        v-model="otherTime"
        placeholder="e.g. Before 9am or after 5:30pm"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import { today as getToday, getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

const modelValue = defineModel<DateValue[]>({ default: () => [] });
const times = defineModel<string[]>("times", { default: () => [] });
const otherTime = defineModel<string>("otherTime", { default: "" });

const today = getToday(getLocalTimeZone());
</script>
