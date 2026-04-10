<template>
  <UDropdownMenu
    v-if="calendarDate"
    :items="items"
    :content="{ align: 'start' }"
    :ui="{ content: 'w-44 text-sm', itemLeadingIcon: 'text-secondary' }"
  >
    <UButton
      :icon="isRescheduled ? 'i-lucide-calendar-clock' : 'i-lucide-calendar-plus'"
      size="xs"
      color="secondary"
      variant="subtle"
      class="body-sm"
    >
      {{ isRescheduled ? "Update calendar" : "Add to calendar" }}
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { ViewingWithDetails } from "~~/shared/types/viewing";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{ viewing: ViewingWithDetails }>();

const isRescheduled = computed(() => props.viewing.status === "RESCHEDULED");

const calendarDate = computed(() => {
  // Calendar export is only available once a specific time has been confirmed
  // (set via the reschedule modal by either party)
  const { counterProposedAt } = props.viewing;
  return counterProposedAt ? new Date(counterProposedAt) : null;
});

const eventEnd = computed(() => {
  if (!calendarDate.value) return null;
  const end = new Date(calendarDate.value);
  end.setHours(end.getHours() + 1);
  return end;
});

const eventTitle = computed(() => {
  const addr = props.viewing.listing?.property?.address?.fullAddress;
  return addr ? `Property Viewing — ${addr}` : "Property Viewing — Virify";
});

const eventLocation = computed(
  () => props.viewing.listing?.property?.address?.fullAddress ?? "",
);

const items = computed((): DropdownMenuItem[] => [
  {
    label: "Google Calendar",
    icon: "i-lucide-calendar",
    to: viewingGoogleCalendarUrl(
      eventTitle.value,
      calendarDate.value!,
      eventEnd.value!,
      eventLocation.value,
    ),
    target: "_blank",
  },
  {
    label: "Outlook",
    icon: "i-lucide-mail",
    to: viewingOutlookCalendarUrl(
      eventTitle.value,
      calendarDate.value!,
      eventEnd.value!,
      eventLocation.value,
    ),
    target: "_blank",
  },
  {
    label: "Download .ics",
    icon: "i-lucide-download",
    onSelect() {
      downloadViewingICS(
        `viewing-${props.viewing.id}@virify.co.uk`,
        eventTitle.value,
        calendarDate.value!,
        eventEnd.value!,
        eventLocation.value,
      );
    },
  },
]);
</script>
