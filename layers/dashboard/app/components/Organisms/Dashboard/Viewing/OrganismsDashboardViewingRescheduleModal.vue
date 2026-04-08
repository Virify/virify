<template>
  <UModal v-model:open="isOpen" title="Propose a new time"
    description="Suggest an alternative date and time for this viewing.">
    <template #close>
      <UButton icon="i-lucide-x" variant="ghost" size="sm" color="neutral" @click="isOpen = false" />
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <UCalendar :model-value="(selectedDate as any)" :min-value="(today as any)" class="mx-auto" :ui="{
          headCell: 'text-secondary!'
        }" @update:model-value="selectedDate = $event as DateValue" />
        <UFormField label="Time">
          <UInput v-model="selectedTime" type="time" class="w-full" />
        </UFormField>
        <UFormField label="Notes (optional)">
          <UTextarea v-model="notes" placeholder="Add any notes for the new time..." :rows="3" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="subtle" color="neutral" @click="isOpen = false">Cancel</UButton>
        <UButton :disabled="!canSubmit" :loading="submitting" icon="i-lucide-calendar-check" variant="solid" :ui="{ base: 'text-white!' }" class="bg-(--blue-300) cursor-pointer body-sm" @click="submit">
          Propose time
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { today as getToday, getLocalTimeZone } from "@internationalized/date";
import type { CalendarDate, DateValue } from "@internationalized/date";
import type { ViewingWithDetails } from "~~/shared/types/viewing";

const emit = defineEmits<{
  (e: "submitted", viewing: ViewingWithDetails): void;
}>();

const isOpen = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  viewingId: number | null;
}>();

const { respondToViewing } = useViewings();

const today = getToday(getLocalTimeZone());
const selectedDate = ref<DateValue>(today);
const selectedTime = ref("10:00");
const notes = ref("");
const submitting = ref(false);

const canSubmit = computed(() => !!selectedDate.value && !!selectedTime.value);

async function submit() {
  if (!props.viewingId || !canSubmit.value) return;
  submitting.value = true;

  const [hours, minutes] = selectedTime.value.split(":").map(Number);
  const native = (selectedDate.value as CalendarDate).toDate(getLocalTimeZone());
  native.setHours(hours!, minutes!, 0, 0);

  const result = await respondToViewing(props.viewingId, {
    response: "reschedule",
    counterProposedAt: native.toISOString(),
  });

  submitting.value = false;
  if (result) {
    emit("submitted", result);
    isOpen.value = false;
  }
}

// Reset form when modal closes
watch(isOpen, (val) => {
  if (!val) {
    selectedDate.value = today as DateValue;
    selectedTime.value = "10:00";
    notes.value = "";
  }
});
</script>
