<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar class="body-sm px-3" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
      }">
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>
        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        <USkeleton v-for="i in 6" :key="i" class="h-48 rounded-xl" />
      </div>

      <!-- Tabs: Incoming / Outgoing -->
      <template v-else>
        <div class="p-4">
          <UTabs v-model="activeTab" :items="tabs" color="secondary" class="mb-4 text-base" />

          <div v-if="displayedViewings.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <OrganismsDashboardViewingCard v-for="viewing in displayedViewings" :key="viewing.id" :viewing="viewing"
              :current-user-id="currentUserId!" @accept="handleAccept" @reject="handleReject"
              @reschedule="openReschedule" @cancel="handleCancel" @accept-counter="handleAcceptCounter" />
          </div>

          <OrganismsDashboardNoResults v-else description="No viewings found." />
        </div>
      </template>
    </template>
  </UDashboardPanel>

  <!-- Reschedule modal -->
  <LazyOrganismsDashboardViewingRescheduleModal v-model:open="rescheduleOpen" :viewing-id="rescheduleViewingId"
    @submitted="onRescheduled" />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Viewings",
    icon: "i-lucide-calendar",
  },
  layout: "dashboard",
});

const { user } = useUserSession();
const currentUserId = computed(() => user.value?.id ?? null);
const requestFetch = useRequestFetch();

const { respondToViewing, cancelViewing } = useViewings();

const { data: viewingsData, pending: loading } = useAsyncData(
  () => `viewings:${user.value?.id}`,
  () => user.value?.id
    ? requestFetch<ViewingWithDetails[]>('/api/viewing')
    : Promise.resolve<ViewingWithDetails[]>([]),
  { server: true, default: () => [] as ViewingWithDetails[] }
);

// Tabs
const activeTab = ref("requested");

const confirmedViewings = computed(() => viewingsData.value.filter((v) => v.status === "ACCEPTED"));
const requestedViewings = computed(() => viewingsData.value.filter((v) => v.status === "PENDING"));
const rescheduledViewings = computed(() => viewingsData.value.filter((v) => v.status === "RESCHEDULED"));

const tabs = computed(() => [
  { label: `Confirmed (${confirmedViewings.value.length})`, value: "confirmed" },
  { label: `Requested (${requestedViewings.value.length})`, value: "requested" },
  { label: `Rescheduled (${rescheduledViewings.value.length})`, value: "rescheduled" },
  { label: `All (${viewingsData.value.length})`, value: "all" },
]);

const displayedViewings = computed(() => {
  if (activeTab.value === "confirmed") return confirmedViewings.value;
  if (activeTab.value === "requested") return requestedViewings.value;
  if (activeTab.value === "rescheduled") return rescheduledViewings.value;
  return [...viewingsData.value];
});

// Reschedule modal
const rescheduleOpen = ref(false);
const rescheduleViewingId = ref<number | null>(null);

function openReschedule(viewing: ViewingWithDetails) {
  rescheduleViewingId.value = viewing.id;
  rescheduleOpen.value = true;
}

function onRescheduled(_viewing: ViewingWithDetails) {
  rescheduleOpen.value = false;
}

async function handleAccept(id: number) {
  await respondToViewing(id, { response: "accept" });
}

async function handleReject(id: number) {
  await respondToViewing(id, { response: "reject" });
}

async function handleCancel(id: number) {
  await cancelViewing(id);
}

async function handleAcceptCounter(id: number) {
  await respondToViewing(id, { response: "accept" });
}
</script>
