<template>
  <UModal v-model:open="isOpen">
    <template #title>
      <div>
        <p class="title-sm m-0!">{{ modalTitle }}</p>
        <p class="body-xs text-(--foreground-200) mt-0.5">{{ modalSubtitle }}</p>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- ACCEPT MODE: requester's availability as context -->
        <MoleculesDashboardViewingContextPanel
          v-if="isAccept && viewing?.proposedDates.length"
          :title="contextTitle"
          :date-badges="proposedDateBadges"
          :time-badges="viewing.preferredTimes"
        />

        <!-- ACCEPT MODE: single-date calendar restricted to requester's dates -->
        <MoleculesDashboardViewingAcceptForm
          v-if="isAccept"
          :model-value="(selectedDate as any)"
          v-model:time="selectedTime"
          :is-date-unavailable="checkDateUnavailable"
          :time-range-buttons="timeRangeButtons"
          @update:model-value="selectedDate = $event as DateValue"
        />

        <!-- RESCHEDULE MODE: multi-date calendar + time preferences -->
        <MoleculesDashboardViewingAvailabilityForm
          v-else
          v-model="selectedDates"
          v-model:times="selectedTimes"
          v-model:other-time="otherTime"
        />

        <UFormField label="Notes (optional)">
          <UTextarea v-model="notes" placeholder="Add any notes..." :rows="2" class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton variant="subtle" color="neutral" class="body-sm" @click="isOpen = false">Cancel</UButton>
        <UButton
          :disabled="!canSubmit"
          :loading="submitting"
          :icon="isAccept ? 'i-lucide-calendar-check' : 'i-lucide-calendar-clock'"
          variant="solid"
          :ui="{ base: 'text-white!' }"
          class="bg-(--blue-300) cursor-pointer body-sm"
          @click="submit"
        >
          {{ isAccept ? 'Confirm viewing' : 'Propose dates' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { today as getToday, getLocalTimeZone, parseDate } from "@internationalized/date";
import type { CalendarDate, DateValue } from "@internationalized/date";
import type { ViewingWithDetails } from "~~/shared/types/viewing";

const emit = defineEmits<{
  (e: "submitted", viewing: ViewingWithDetails): void;
}>();

const isOpen = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  viewingId: number | null;
  viewing?: ViewingWithDetails | null;
  mode?: "accept" | "reschedule";
}>();

const { respondToViewing, counterProposeViewing } = useViewings();

const today = getToday(getLocalTimeZone());

// Computed mode flags + modal copy
const isAccept = computed(() => props.mode === "accept");
const modalTitle = computed(() => (isAccept.value ? "Confirm a time" : "Propose new dates"));
const modalSubtitle = computed(() =>
  isAccept.value
    ? "Pick a date and time to confirm the viewing."
    : "Suggest alternative dates and times for this viewing.",
);

// Context panel data for accept mode
const contextTitle = computed(() =>
  props.viewing?.requester.username
    ? `${props.viewing.requester.username}'s availability`
    : "Requester's availability",
);
const proposedDateBadges = computed(() =>
  props.viewing?.proposedDates.map(formatProposedDate) ?? [],
);

// Allowed dates set + unavailability checker for the accept-mode calendar
const allowedDateStrings = computed<Set<string>>(() => {
  if (!isAccept.value || !props.viewing?.proposedDates.length) return new Set();
  return getAllowedDateStrings(props.viewing.proposedDates);
});

const timeRangeButtons = computed(() => {
  if (!isAccept.value || !props.viewing?.preferredTimes.length) return [];
  return getTimeRangeButtons(props.viewing.preferredTimes);
});

function checkDateUnavailable(date: DateValue): boolean {
  return isViewingDateUnavailable(date, allowedDateStrings.value);
}

// Accept mode state
const selectedDate = ref<DateValue>(today);
const selectedTime = ref("10:00");

// Reschedule mode state
const selectedDates = shallowRef<DateValue[]>([]);
const selectedTimes = ref<string[]>([]);
const otherTime = ref("");

const notes = ref("");
const submitting = ref(false);

const canSubmit = computed(() => {
  if (isAccept.value) return !!selectedDate.value && !!selectedTime.value;
  return selectedDates.value.length > 0 && selectedTimes.value.length > 0;
});

async function submit() {
  if (!props.viewingId || !canSubmit.value) return;
  submitting.value = true;

  let result: ViewingWithDetails | null = null;

  if (isAccept.value) {
    const [hours, minutes] = selectedTime.value.split(":").map(Number);
    const native = (selectedDate.value as CalendarDate).toDate(getLocalTimeZone());
    native.setHours(hours!, minutes!, 0, 0);
    result = await respondToViewing(props.viewingId, {
      response: "accept",
      counterProposedAt: native.toISOString(),
    });
  } else {
    const finalTimes = resolveFinalTimes(selectedTimes.value, otherTime.value);
    const proposedDatesStr = (selectedDates.value as CalendarDate[]).map((d) => d.toString());
    result = await counterProposeViewing(props.viewingId, {
      proposedDates: proposedDatesStr,
      preferredTimes: finalTimes,
      notes: notes.value || undefined,
    });
  }

  submitting.value = false;
  if (result) {
    emit("submitted", result);
    isOpen.value = false;
  }
}

// Default to first allowed date when modal opens in accept mode; reset on close
watch(isOpen, (val) => {
  if (val && isAccept.value && allowedDateStrings.value.size) {
    const firstStr = [...allowedDateStrings.value].sort()[0]!;
    selectedDate.value = parseDate(firstStr);
    if (timeRangeButtons.value.length) {
      selectedTime.value = timeRangeButtons.value[0]!.time;
    }
  } else if (!val) {
    selectedDate.value = today as DateValue;
    selectedTime.value = "10:00";
    selectedDates.value = [];
    selectedTimes.value = [];
    otherTime.value = "";
    notes.value = "";
  }
});
</script>
