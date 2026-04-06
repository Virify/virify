<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
          right: 'flex items-center gap-4',
        }"
      >
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardFilter ref="filterRef" :items="listings" :view-options="[]" persistence-key="dashboard-archived-listings" @update:filtered="filteredListings = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Loading State -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardMyListingSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>

      <!-- Archived Listings Grid -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredListings.length > 0">
        <div v-for="listing in filteredListings" :key="listing.id" class="h-full">
          <OrganismsDashboardListingCardMyListing :listing="listing" @edit="handleEditListing" />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else :description="'No archived listings found.'" />

      <!-- Pagination -->
      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>

      <!-- Shared Listing Editor Modal -->
      <OrganismsDashboardCreateListingModal ref="listingModal" @close="handleModalClose" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Archived Listings",
    icon: "i-lucide-archive",
  },
  layout: "dashboard",
});

import OrganismsDashboardCreateListingModal from '~~/layers/dashboard/app/components/Organisms/Dashboard/CreateListing/OrganismsDashboardCreateListingModal.vue';

const { listings, loading, fetchMyListings, total } = useMyListings();
const pageTop = ref<HTMLElement | null>(null);
const page = ref(1);
const limit = ref(20);
const filteredListings = ref<OwnedListingWithAnalytics[]>([]);
const listingModal = ref<InstanceType<typeof OrganismsDashboardCreateListingModal> | null>(null);

const { sortOrderValue, searchQuery } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-archived-listings",
  hideListingSort: true,
});

const mapSortOrder = computed(() => {
  if (sortOrderValue.value === "newest") return "new";
  if (sortOrderValue.value === "oldest") return "old";
  return "new";
});

watch(
  [mapSortOrder],
  async () => {
    page.value = 1;
    await fetchMyListings('archived', 1, mapSortOrder.value as any, limit.value);
  },
  { immediate: true }
);

async function onPageChange(newPage: number) {
  page.value = newPage;
  await fetchMyListings('archived', newPage, mapSortOrder.value as any, limit.value);

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleEditListing(_payload: { id: number; isDraft: boolean }) {
  // Archived listings cannot be edited directly — use "Convert to Draft" on the card
}

function handleModalClose() {
  fetchMyListings('archived', page.value, mapSortOrder.value as any, limit.value);
}

watch([listings, searchQuery], () => {
  let filtered = listings.value;

  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) =>
      item.property?.address?.fullAddress?.toLowerCase().includes(term) ||
      item.price?.toString().includes(term)
    );
  }

  filteredListings.value = filtered;
});
</script>
