<template>
  <UModal v-model:open="viewingPopoverOpen" title="Viewings">
    <UButton
      icon="i-lucide-calendar-plus"
      variant="solid"
      size="sm"
      :ui="{ leadingIcon: 'text-white' }"
      aria-label="Request a viewing"
    />

    <template v-if="!isOwner && !activeConversationViewings.length" #body>
      <div>
        <UTabs
          v-model="activeTab"
          :items="tabItems"
          size="sm"
          class="w-full body-xs"
          color="secondary"
          variant="pill"
          :ui="{ trigger: 'data-[state=active]:text-white!' }"
        >
          <template #open-house>
            <div class="flex flex-col gap-4 pt-4">
              <template v-for="session in openHouseSessions" :key="session.id">
                <MoleculesDashboardOpenHouseSlotPicker
                  v-model="selectedSlots[session.id]"
                  :session="session"
                />
                <UButton
                  :disabled="!selectedSlots[session.id] || bookingSlot"
                  :loading="bookingSlot"
                  size="sm"
                  variant="solid"
                  class="text-white! w-full justify-center body-sm"
                  icon="i-lucide-calendar-check"
                  @click="handleBookSlot(session)"
                >
                  Book Slot
                </UButton>
              </template>
            </div>
          </template>
          <template #request-viewing>
            <div class="pt-4">
              <MoleculesDashboardViewingRequestForm
                v-model:dates="viewingDates"
                v-model:times="viewingTimes"
                v-model:other-time="viewingOtherTime"
                v-model:notes="viewingNotes"
                :title="
                  conversationViewings.length
                    ? 'Request a New Viewing'
                    : 'Request a Viewing'
                "
                :loading="viewingSubmitting"
                @submit="submitViewingRequest"
              />
            </div>
          </template>
        </UTabs>
      </div>
    </template>

    <template v-if="isOwner || conversationViewings.length" #footer>
      <div class="flex flex-col gap-3 w-full">
        <!-- Scheduled viewings as a row -->
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-calendar"
            class="text-secondary size-4 shrink-0"
          />
          <span class="body-xs font-semibold">Scheduled Viewings</span>
        </div>
        <div v-if="conversationViewings.length" class="flex flex-wrap gap-2">
          <MoleculesDashboardViewingPopoverRow
            v-for="v in conversationViewings"
            :key="v.id"
            :viewing="v"
            :is-owner="isOwner"
            class="w-[calc(50%-0.25rem)] min-w-48"
            @accept-counter="acceptCounterViewing"
            @manage="handleManageViewings"
          />
        </div>
        <p v-else class="body-xs text-muted-foreground">
          No viewings scheduled for this conversation.
        </p>
        <UButton
          icon="i-lucide-calendar-days"
          size="sm"
          variant="solid"
          class="w-full justify-center body-sm"
          :class="{ 'text-white!': !isOwner }"
          @click="handleManageViewings"
        >
          Manage Viewings
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  conversation: ConversationWithMinimalListing | null;
  isOwner: boolean;
}>();

const {
  viewingPopoverOpen,
  viewingDates,
  viewingTimes,
  viewingOtherTime,
  viewingNotes,
  viewingSubmitting,
  conversationViewings,
  activeConversationViewings,
  submitViewingRequest,
  acceptCounterViewing,
} = useViewingRequest(
  () => props.conversation,
  () => props.isOwner,
);

const { fetchSessionsForListing, getSessionsForListing, bookSlot } =
  useOpenHouse();
const { closeConversation } = useGlobalEnquiryModal();

const listingId = computed(() => props.conversation?.listing?.id ?? null);
const openHouseSessions = computed(() =>
  listingId.value ? getSessionsForListing(listingId.value) : [],
);

// Fetch sessions when the popover opens (enquirer only)
watch(viewingPopoverOpen, (val) => {
  if (val && !props.isOwner && listingId.value) {
    fetchSessionsForListing(listingId.value);
  }
});

const tabItems = computed(() => [
  ...(openHouseSessions.value.length
    ? [
        {
          label: "Open House",
          value: "open-house",
          slot: "open-house" as const,
          icon: "i-lucide-door-open",
        },
      ]
    : []),
  {
    label: "Request Viewing",
    value: "request-viewing",
    slot: "request-viewing" as const,
    icon: "i-lucide-calendar-plus",
  },
]);

const activeTab = ref("open-house");

watch(
  openHouseSessions,
  (sessions) => {
    activeTab.value = sessions.length ? "open-house" : "request-viewing";
  },
  { immediate: true },
);

const selectedSlots = reactive<Record<number, string | null>>({});
const bookingSlot = ref(false);

function handleManageViewings() {
  viewingPopoverOpen.value = false;
  closeConversation();
  nextTick(() => navigateTo("/dashboard/viewings"));
}

async function handleBookSlot(session: { id: number; slotMins: number }) {
  const slotTime = selectedSlots[session.id];
  if (!slotTime || !listingId.value) return;

  // Extract start time from label e.g. "10:15–10:30" → "10:15"
  const time = slotTime.split("–")[0]!;

  bookingSlot.value = true;
  await bookSlot(
    session.id,
    time,
    listingId.value,
    props.conversation?.id ?? undefined,
  );
  bookingSlot.value = false;

  // Clear the selected slot on success
  selectedSlots[session.id] = null;
  viewingPopoverOpen.value = false;
}
</script>
