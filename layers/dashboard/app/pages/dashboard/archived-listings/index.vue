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
          <OrganismsDashboardFilterListings :items="listings" persistence-key="dashboard-archived-listings"
            @update:filtered="filteredListings = $event" />
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
          <OrganismsDashboardListingCardMyListing :listing="listing" @edit="handleEditListing"
            @restored="handleRestored" />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else :description="'No archived listings found.'" />

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
    title: "Archived Listings",
    icon: "i-lucide-archive",
  },
  layout: "dashboard",
});

import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';

// Use local state instead of the shared singleton to avoid clobbering
// my-listings data when navigating between active and archived pages
const requestFetch = useRequestFetch();
const listings = ref<OwnedListingWithAnalytics[]>([]);
const loading = ref(true);
const total = ref(0);

const pageTop = ref<HTMLElement | null>(null);
const page = ref(1);
const limit = ref(20);
const filteredListings = ref<OwnedListingWithAnalytics[]>([]);
const listingModal = ref<{ openForNewListing: (tier: any) => void; openForDraft: (id: number) => Promise<void>; openForListing: (id: number) => Promise<void> } | null>(null);

async function fetchArchivedListings(
  pg: number = 1,
  sort: string = 'new',
  take: number = 20,
  saleRent: string = 'all',
) {
  loading.value = true;
  try {
    const data = await requestFetch<{ listings: OwnedListingWithAnalytics[]; total: number }>(
      `/api/user/my-listings/?status=archived&sort=${sort}&page=${pg}&take=${take}&saleRent=${saleRent}`
    );
    listings.value = data.listings || [];
    total.value = data.total || 0;
  } catch (error) {
    console.error('Error fetching archived listings:', error);
    listings.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

const { sortOrderValue, saleRentFilter, searchQuery } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-archived-listings",
  hideListingSort: true,
});

const mapSortOrder = computed(() => {
  if (sortOrderValue.value === "newest") return "new";
  if (sortOrderValue.value === "oldest") return "old";
  return "new";
});

onMounted(async () => {
  await fetchArchivedListings(1, mapSortOrder.value, limit.value, saleRentFilter.value);
});

watch(
  [saleRentFilter, mapSortOrder],
  async () => {
    page.value = 1;
    await fetchArchivedListings(1, mapSortOrder.value, limit.value, saleRentFilter.value);
  },
);

async function onPageChange(newPage: number) {
  page.value = newPage;
  await fetchArchivedListings(newPage, mapSortOrder.value, limit.value, saleRentFilter.value);

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

async function handleEditListing(_payload: { id: number; isDraft: boolean }) {
  // Archived listings cannot be edited directly — use "Convert to Draft" on the card
}

function handleRestored(id: number) {
  const idx = listings.value.findIndex((l) => l.id === id);
  if (idx !== -1) {
    listings.value.splice(idx, 1);
    total.value -= 1;
  }
}

function handleModalClose() {
  fetchArchivedListings(page.value, mapSortOrder.value, limit.value, saleRentFilter.value);
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
