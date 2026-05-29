<template>
  <UModal v-model:open="open" title="Open House">
    <UTooltip
      :text="
        isPublished
          ? 'Manage open house'
          : 'Publish listing to enable open house'
      "
      :delay-open="300"
    >
      <UButton
        icon="i-lucide-calendar-search"
        size="sm"
        variant="ghost"
        :disabled="!isPublished"
        aria-label="Manage open house"
      />
    </UTooltip>

    <template #body>
      <div class="flex flex-col gap-2">
        <p class="body-sm font-semibold">
          {{ sessions.length ? "Add another session" : "Schedule open house" }}
        </p>
        <MoleculesDashboardOpenHouseSessionForm
          :loading="creating"
          @submit="handleCreate"
        />
      </div>
    </template>

    <template v-if="sessions.length" #footer>
      <div class="flex flex-col gap-3 w-full">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-calendar"
            class="text-secondary size-4 shrink-0"
          />
          <span class="body-xs font-semibold">Scheduled Sessions</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="s in sessions"
            :key="s.id"
            class="flex items-center justify-between rounded-lg border border-border px-3 py-2 flex-1 min-w-48"
          >
            <div class="flex flex-col">
              <span class="body-sm font-medium">{{
                formatOpenHouseDate(s.date)
              }}</span>
              <span class="body-xs text-muted-foreground">
                {{ s.startTime }}–{{ s.endTime }} · {{ bookedCount(s) }}/{{
                  slotCount(s)
                }}
                booked
              </span>
            </div>
            <UButton
              icon="i-lucide-trash-2"
              size="xs"
              variant="ghost"
              color="error"
              :loading="deletingId === s.id"
              aria-label="Delete session"
              @click="handleDelete(s.id)"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  listingId: number;
  isPublished: boolean;
}>();

const {
  getSessionsForListing,
  fetchSessionsForListing,
  createSession,
  deleteSession,
} = useOpenHouse();

const open = ref(false);
const creating = ref(false);
const deletingId = ref<number | null>(null);

const sessions = computed(() => getSessionsForListing(props.listingId));

watch(open, (val) => {
  if (val) fetchSessionsForListing(props.listingId);
});

function slotCount(s: {
  startTime: string;
  endTime: string;
  slotMins: number;
}): number {
  const [sh, sm] = s.startTime.split(":").map(Number);
  const [eh, em] = s.endTime.split(":").map(Number);
  return Math.floor((eh! * 60 + em! - (sh! * 60 + sm!)) / s.slotMins);
}

function bookedCount(s: { bookedSlots: string[] }): number {
  return s.bookedSlots.length;
}

async function handleCreate(payload: {
  date: string;
  startTime: string;
  endTime: string;
}) {
  creating.value = true;
  await createSession({ listingId: props.listingId, ...payload });
  creating.value = false;
}

async function handleDelete(id: number) {
  deletingId.value = id;
  await deleteSession(id, props.listingId);
  deletingId.value = null;
}
</script>
