<template>
  <UModal v-model:open="isOpen">
    <template #title>
      <div>
        <p class="title-sm m-0!">Suggest new times</p>
        <p class="body-xs text-(--foreground-200) mt-0.5">Send the owner your updated availability.</p>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- Owner's counter-proposed time as context -->
        <MoleculesDashboardViewingContextPanel
          v-if="viewing?.counterProposedAt"
          title="Owner's proposed time"
          :date-text="formatViewingDateTime(viewing.counterProposedAt)"
          description="If this doesn't work for you, suggest new dates below."
        />

        <!-- Multi-date calendar + time prefs -->
        <MoleculesDashboardViewingAvailabilityForm
          v-model="selectedDates"
          v-model:times="selectedTimes"
          v-model:other-time="otherTime"
        />

        <UFormField label="Notes (optional)">
          <UTextarea v-model="notes" placeholder="Any additional context..." :rows="2" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="subtle" color="neutral" class="body-sm" @click="isOpen = false">Cancel</UButton>
        <UButton
          :disabled="!canSubmit"
          :loading="submitting"
          icon="i-lucide-calendar-clock"
          variant="solid"
          :ui="{ base: 'text-white!' }"
          class="bg-(--blue-300) cursor-pointer body-sm"
          @click="submit"
        >
          Send availability
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { CalendarDate, DateValue } from "@internationalized/date";
import type { ViewingWithDetails } from "~~/shared/types/viewing";

const emit = defineEmits<{
  (e: "submitted", viewing: ViewingWithDetails): void;
}>();

const isOpen = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  viewingId: number | null;
  viewing?: ViewingWithDetails | null;
}>();

const { counterProposeViewing } = useViewings();

const selectedDates = shallowRef<DateValue[]>([]);
const selectedTimes = ref<string[]>([]);
const otherTime = ref("");
const notes = ref("");
const submitting = ref(false);

const canSubmit = computed(
  () => selectedDates.value.length > 0 && selectedTimes.value.length > 0,
);

async function submit() {
  if (!props.viewingId || !canSubmit.value) return;
  submitting.value = true;

  const finalTimes = resolveFinalTimes(selectedTimes.value, otherTime.value);
  const proposedDates = (selectedDates.value as CalendarDate[]).map((d) => d.toString());

  const result = await counterProposeViewing(props.viewingId, {
    proposedDates,
    preferredTimes: finalTimes,
    notes: notes.value || undefined,
  });

  submitting.value = false;
  if (result) {
    emit("submitted", result);
    isOpen.value = false;
  }
}

watch(isOpen, (val) => {
  if (!val) {
    selectedDates.value = [];
    selectedTimes.value = [];
    otherTime.value = "";
    notes.value = "";
  }
});
</script>
