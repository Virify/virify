<template>
  <div class="flex flex-col gap-3">
    <UCalendar
      :model-value="calendarDate as any"
      :min-value="today as any"
      :is-date-unavailable="(date: DateValue) => date.compare(today) < 0"
      size="sm"
      class="mx-auto"
      :ui="{
        headCell: 'text-secondary!',
        cellTrigger:
          'data-unavailable:line-through data-unavailable:text-secondary!',
      }"
      @update:model-value="calendarDate = $event as DateValue"
    />
    <div class="flex gap-2">
      <UFormField label="Start" class="flex-1">
        <UInput v-model="startTime" type="time" class="w-full" />
      </UFormField>
      <UFormField label="End" class="flex-1">
        <UInput v-model="endTime" type="time" class="w-full" />
      </UFormField>
    </div>
    <p v-if="slotPreview" class="body-xs text-muted-foreground">
      {{ slotPreview }} × 15-min slots
    </p>
    <UButton
      :disabled="!canSubmit"
      :loading="loading"
      icon="i-lucide-plus"
      size="xs"
      variant="solid"
      class="text-white! w-full justify-center body-sm"
      @click="handleSubmit"
    >
      Add Session
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { today as getToday, getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

defineProps<{ loading?: boolean }>();

const emit = defineEmits<{
  submit: [{ date: string; startTime: string; endTime: string }];
}>();

const calendarDate = ref<DateValue | null>(null);
const startTime = ref("10:00");
const endTime = ref("13:00");

const today = getToday(getLocalTimeZone());

const startTotal = computed(() => {
  const [h, m] = startTime.value.split(":").map(Number);
  return h! * 60 + m!;
});
const endTotal = computed(() => {
  const [h, m] = endTime.value.split(":").map(Number);
  return h! * 60 + m!;
});

const canSubmit = computed(
  () =>
    !!calendarDate.value &&
    !!startTime.value &&
    !!endTime.value &&
    startTotal.value < endTotal.value,
);

const slotPreview = computed(() => {
  if (!canSubmit.value) return null;
  return Math.floor((endTotal.value - startTotal.value) / 15);
});

function dateToString(d: DateValue): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

function handleSubmit() {
  if (!canSubmit.value || !calendarDate.value) return;
  emit("submit", {
    date: dateToString(calendarDate.value),
    startTime: startTime.value,
    endTime: endTime.value,
  });
  calendarDate.value = null;
  startTime.value = "10:00";
  endTime.value = "13:00";
}
</script>
