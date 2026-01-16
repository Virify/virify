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
          <OrganismsDashboardFilter ref="filterRef" :items="listings" :view-options="[]" persistence-key="dashboard-my-listings" @update:filtered="filteredListings = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Grid View -->
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardMyListingSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>

      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredListings.length > 0">
        <div v-for="listing in filteredListings" :key="listing.id" class="h-full">
          <OrganismsDashboardListingCardMyListing :listing="listing" />
        </div>
      </OrganismsDashboardListingCardGrid>

      <!-- No Results -->
      <OrganismsDashboardNoResults v-else :description="'No listings found.'" />

      <!-- Pagination -->
      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { PricingPlanProps } from '@nuxt/ui';


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

const plans = ref<PricingPlanProps[]>([
  {
    title: 'Standard',
    description: 'Entry level tier',
    badge: 'Most value',
    features: [
      'Listing creator tools',
      'Up to 8 images',
      'Verified identification and property ownership',
      'Basic analytics'
    ],
    button: {
      label: 'Create Listing',
      color: 'neutral' as const,
      variant: 'subtle' as const
    }
  },
  
  {
    title: 'Premium',
    description: 'Ideal for larger teams and organizations.',
    scale: true,
    button: {
      label: 'Create Listing',
      color: 'primary' as const,
      variant: 'subtle' as const
    },
    features: [
      'Everything in Premium, plus:',
      'Larger more detailed listing cards',
      'Gallery on search results',
      'Priority placement',
      'Up to 50 images',
      'Priotity support',
      'Professional analytics',
    ]
  },
  {
    title: 'Professional',
    description: 'Serious sellers and landlords',
    button: {
      label: 'Create Listing',
      color: 'secondary' as const,
      variant: 'subtle' as const
    },
    features: [
      'Everything in Standard, plus:',
      'Up to 25 images',
      'Video media uploads',
      'Improved listing card visibility',
      'Advanced analytics',
    ]
  },
])

const { sortOrderValue, searchQuery, saleRentFilter } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-my-listings",
  hideListingSort: true,
});

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
    await fetchMyListings(saleRentFilter.value as any, 1, mapSortOrder.value as any, limit.value);
  },
  { immediate: true }
);

// Handle page changes from pagination component
async function onPageChange(newPage: number) {
  page.value = newPage;
  await fetchMyListings(saleRentFilter.value as any, newPage, mapSortOrder.value as any, limit.value);

  const el = (pageTop.value as any)?.$el ?? pageTop.value;
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto");
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
}

// Filter listings by sale/rent + search after API returns
watch([listings, searchQuery], () => {
  let filtered = listings.value;

  if (saleRentFilter.value === "sale") {
    filtered = filtered.filter((item) => !!item.saleListing && !item.rentalListing);
  } else if (saleRentFilter.value === "rent") {
    filtered = filtered.filter((item) => !!item.rentalListing);
  }

  // Apply search filter if present
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase();
    filtered = filtered.filter((item) => item.property?.address?.fullAddress?.toLowerCase().includes(term) || item.price?.toString().includes(term));
  }

  filteredListings.value = filtered;
});
</script>
