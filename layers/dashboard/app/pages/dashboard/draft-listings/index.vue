<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :ui="{
        title: 'title-sm m-0!',
        right: 'flex items-center gap-1',
      }">
        <template #title>
          <MoleculesDashboardBreadcrumb />
        </template>

        <template #right>
          <OrganismsDashboardFilterListings :items="draftListings" persistence-key="dashboard-draft-listings"
            :hide-sale-rent-filter="true" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Tier Selection Table -->
      <MoleculesDashboardPriceTier v-if="!draftListings.length && !loading" @select-tier="handleCreateListing" />

      <!-- Loading State -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardMyListingSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>

      <!-- Draft Listings Grid -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredDrafts.length > 0">
        <div v-for="draft in filteredDrafts" :key="draft.id" class="h-full">
          <OrganismsDashboardListingCardMyListing :listing="draft" @edit="handleEditDraft" />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else :description="'No draft listings found. Start creating a new listing!'" />

      <!-- Pagination -->
      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit"
          variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>

      <!-- Shared Listing Editor Modal -->
      <LazyOrganismsDashboardCreateListingModal ref="listingModal" @close="handleModalClose" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Draft Listings",
    icon: "i-lucide-file-text",
  },
  layout: "dashboard",
});

// Draft listings state
const { draftListings, loading, total, fetchDraftListings, refetchCurrentPage } = useDraftListings();
const pageTop = ref<HTMLElement | null>(null);
const page = ref(1);
const limit = ref(20);

// Use existing filter composable (only need sort and search for drafts)
const { sortOrderValue, searchQuery } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-draft-listings",
  hideListingSort: true,
});

// Map sort order to API enum
const mapSortOrder = computed(() => {
  if (sortOrderValue.value === "newest") return "new";
  if (sortOrderValue.value === "oldest") return "old";
  return "new";
});

// Modal ref
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';
const listingModal = ref<{ openForNewListing: (tier: any) => void; openForDraft: (id: number) => Promise<void>; openForListing: (id: number) => Promise<void> } | null>(null);

// Handle create listing from tier table
function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier);
}

// Watch filter changes and re-fetch from API
watch(
  [mapSortOrder],
  async () => {
    page.value = 1;
    await fetchDraftListings(1, mapSortOrder.value as any, limit.value);
  },
  { immediate: true }
);

// Client-side search filtering
const filteredDrafts = computed(() => {
  if (!searchQuery.value) return draftListings.value;

  const term = searchQuery.value.toLowerCase();
  return draftListings.value.filter((draft) =>
    draft.property?.address?.fullAddress?.toLowerCase().includes(term) ||
    draft.price?.toString().includes(term)
  );
});

// Handle page changes
async function onPageChange(newPage: number) {
  page.value = newPage;
  await fetchDraftListings(newPage, mapSortOrder.value as any, limit.value);

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

// Handle edit draft - open modal
async function handleEditDraft(payload: { id: number; isDraft: boolean }) {
  await listingModal.value?.openForDraft(payload.id);
}

// Handle modal close - refetch to get any updates
function handleModalClose() {
  refetchCurrentPage();
}
</script>
