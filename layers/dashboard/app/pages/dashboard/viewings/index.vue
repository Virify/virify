<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar class="body-sm px-3" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
        right: 'flex items-center gap-1',
      }">
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>
        <template #right>
          <OrganismsDashboardFilterListings
            :items="tabViewings"
            date-key="createdAt"
            hide-sale-rent-filter
            hide-search
            persistence-key="dashboard-viewings"
            @update:filtered="filteredViewings = $event"
          />
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
          <UTabs v-model="activeTab" :items="tabs" color="secondary" class="mb-4 text-base" :ui="{
            trigger: 'data-[state=active]:text-white!'
          }" />

          <div v-if="filteredViewings.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <OrganismsDashboardViewingCard v-for="viewing in filteredViewings" :key="viewing.id" :viewing="viewing"
              :current-user-id="currentUserId!" @accept="handleAccept" @reject="handleReject"
              @reschedule="openReschedule" @cancel="handleCancel" @accept-counter="handleAcceptCounter"
              @counter-propose="openCounterPropose" />
          </div>

          <OrganismsDashboardNoResults v-else type="viewings" />
        </div>
      </template>
    </template>
  </UDashboardPanel>

  <!-- Reschedule / Confirm modal (owner) -->
  <LazyOrganismsDashboardViewingRescheduleModal
    v-model:open="rescheduleOpen"
    :viewing-id="rescheduleViewing?.id ?? null"
    :viewing="rescheduleViewing"
    :mode="rescheduleMode"
    @submitted="onRescheduled"
  />

  <!-- Counter-propose modal (buyer) -->
  <LazyOrganismsDashboardViewingCounterProposeModal
    v-model:open="counterProposeOpen"
    :viewing-id="counterProposeViewing?.id ?? null"
    :viewing="counterProposeViewing"
    @submitted="onCounterProposed"
  />
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

const { viewings, loading, respondToViewing, cancelViewing, fetchViewings } = useViewings();

const { sortOrderValue } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-viewings' });

// Ensure the shared ref is populated when landing directly on this page
onMounted(() => {
  fetchViewings(sortOrderValue.value === 'oldest' ? 'oldest' : 'newest').catch((e) => console.error("Failed to fetch viewings", e));
});

// Re-fetch when sort order changes
watch(sortOrderValue, (sort) => {
  fetchViewings(sort === 'oldest' ? 'oldest' : 'newest').catch((e) => console.error("Failed to re-fetch viewings", e));
});

// Read tab from query param (e.g. from notification click)
const route = useRoute();
const activeTab = ref((route.query.tab as string) || "all");

const confirmedViewings = computed(() => viewings.value.filter((v) => v.status === "ACCEPTED"));
const requestedViewings = computed(() => viewings.value.filter((v) => v.status === "PENDING"));
const rescheduledViewings = computed(() => viewings.value.filter((v) => v.status === "RESCHEDULED"));

const tabs = computed(() => [
  { label: `Confirmed (${confirmedViewings.value.length})`, value: "confirmed" },
  { label: `Requested (${requestedViewings.value.length})`, value: "requested" },
  { label: `Rescheduled (${rescheduledViewings.value.length})`, value: "rescheduled" },
  { label: `All (${viewings.value.length})`, value: "all" },
]);

const tabViewings = computed<ViewingWithDetails[]>(() => {
  if (activeTab.value === "confirmed") return [...confirmedViewings.value];
  if (activeTab.value === "requested") return [...requestedViewings.value];
  if (activeTab.value === "rescheduled") return [...rescheduledViewings.value];
  return [...viewings.value];
});

const filteredViewings = ref<ViewingWithDetails[]>([]);

// ─── Reschedule / Confirm modal (owner) ──────────────────────────────────────
const rescheduleOpen = ref(false);
const rescheduleViewing = ref<ViewingWithDetails | null>(null);
const rescheduleMode = ref<'accept' | 'reschedule'>('reschedule');

function openReschedule(viewing: ViewingWithDetails) {
  rescheduleViewing.value = viewing;
  rescheduleMode.value = 'reschedule';
  rescheduleOpen.value = true;
}

function onRescheduled(_viewing: ViewingWithDetails) {
  rescheduleOpen.value = false;
  activeTab.value = rescheduleMode.value === 'accept' ? 'confirmed' : 'rescheduled';
}

// ─── Counter-propose modal (buyer) ──────────────────────────────────────────
const counterProposeOpen = ref(false);
const counterProposeViewing = ref<ViewingWithDetails | null>(null);

function openCounterPropose(viewing: ViewingWithDetails) {
  counterProposeViewing.value = viewing;
  counterProposeOpen.value = true;
}

function onCounterProposed(_viewing: ViewingWithDetails) {
  counterProposeOpen.value = false;
  activeTab.value = "requested";
}

// ─── Action handlers ─────────────────────────────────────────────────────────

async function handleAccept(id: number) {
  // Instead of directly accepting, open the confirm modal so the owner picks a date+time
  const v = viewings.value.find((v) => v.id === id);
  if (v) {
    rescheduleViewing.value = v;
    rescheduleMode.value = 'accept';
    rescheduleOpen.value = true;
  }
}

async function handleReject(id: number) {
  await respondToViewing(id, { response: "reject" });
  activeTab.value = "all";
}

async function handleCancel(id: number) {
  await cancelViewing(id);
  activeTab.value = "all";
}

async function handleAcceptCounter(id: number) {
  await respondToViewing(id, { response: "accept" });
  activeTab.value = "confirmed";
}
</script>
