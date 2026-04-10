<template>
  <div class="flex flex-col gap-3">
    <h3 class="body-sm font-semibold">{{ title }}</h3>

    <!-- Availability: calendar + time prefs + freeform other -->
    <MoleculesDashboardViewingAvailabilityForm
      v-model="dates"
      v-model:times="times"
      v-model:other-time="otherTime"
    />

    <!-- Notes -->
    <UFormField label="Notes (optional)">
      <UTextarea v-model="notes" placeholder="Any additional notes..." :rows="2" class="w-full" />
    </UFormField>

    <!-- Submit -->
    <UButton
      :disabled="!canSubmit"
      :loading="loading"
      icon="i-lucide-calendar-check"
      size="sm"
      variant="solid"
      :ui="{ base: 'text-white!' }"
      class="bg-(--blue-300) cursor-pointer body-sm"
      @click="$emit('submit')"
    >
      Request Viewing
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date";

defineProps<{
  title: string;
  loading?: boolean;
}>();

defineEmits<{ (e: "submit"): void }>();

const dates = defineModel<DateValue[]>("dates", { default: () => [] });
const times = defineModel<string[]>("times", { default: () => [] });
const otherTime = defineModel<string>("otherTime", { default: "" });
const notes = defineModel<string>("notes", { default: "" });

const canSubmit = computed(() => dates.value.length > 0 && times.value.length > 0);
</script>
