<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :ui="{
          title: 'title-sm m-0!',
          right: 'flex items-center gap-1',
        }"
      >
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardFilterListings :items="listings" persistence-key="dashboard-my-listings" @update:filtered="filteredListings = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Tier Selection Table -->
      <MoleculesDashboardPriceTier v-if="!listings.length && !loading" @select-tier="handleCreateListing" />

      <!-- Grid View -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardMyListingSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>

      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredListings.length > 0">
        <div v-for="listing in filteredListings" :key="listing.id" class="h-full">
          <OrganismsDashboardListingCardMyListing :listing="listing" @edit="handleEditListing" />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else :description="'No listings found.'" />

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
    title: "Your Listings",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

const { listings, loading, fetchMyListings, total } = useMyListings();
const pageTop = ref<HTMLElement | null>(null);
const page = ref(1);
const limit = ref(20);
const filteredListings = ref<OwnedListingWithAnalytics[]>([]);

// Modal ref
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';
import OrganismsDashboardCreateListingModal from '~~/layers/dashboard/app/components/Organisms/Dashboard/CreateListing/OrganismsDashboardCreateListingModal.vue';
const listingModal = ref<InstanceType<typeof OrganismsDashboardCreateListingModal> | null>(null);

// Handle create listing from tier table
function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier);
}

const { sortOrderValue, searchQuery, saleRentFilter } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-my-listings",
  hideListingSort: true,
})

// Map sort order value to API enum
const mapSortOrder = computed(() => {
  if (sortOrderValue.value === "newest") return "new";
  if (sortOrderValue.value === "oldest") return "old";
  return "new";
});

// Watch filter changes and re-fetch from API (reset to page 1)
watch(
  [saleRentFilter, mapSortOrder],
  async () => {
    page.value = 1;
    // status='all' since we don't have a status filter UI, saleRent filter is passed as 5th param
    await fetchMyListings('all', 1, mapSortOrder.value as any, limit.value, saleRentFilter.value as any);
  },
  { immediate: true }
);

// Handle page changes from pagination component
async function onPageChange(newPage: number) {
  page.value = newPage;
  await fetchMyListings('all', newPage, mapSortOrder.value as any, limit.value, saleRentFilter.value as any);

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle edit listing - open modal
async function handleEditListing(payload: { id: number; isDraft: boolean }) {
  if (payload.isDraft) {
    await listingModal.value?.openForDraft(payload.id);
  } else {
    await listingModal.value?.openForListing(payload.id);
  }
}

// Handle modal close - refetch to get any updates
function handleModalClose() {
  fetchMyListings('all', page.value, mapSortOrder.value as any, limit.value, saleRentFilter.value as any);
}

// Apply search filter after API returns (sale/rent is now filtered by backend)
watch([listings, searchQuery], () => {
  let filtered = listings.value;

  // Apply search filter if present
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => item.property?.address?.fullAddress?.toLowerCase().includes(term) || item.price?.toString().includes(term));
  }

  filteredListings.value = filtered;
});
</script>
