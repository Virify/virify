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
          <OrganismsDashboardFilterListings :items="pageListings" persistence-key="dashboard-my-listings"
            @update:filtered="filteredListings = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <!-- Tier Selection Table -->
      <MoleculesDashboardPriceTier v-if="!pageListings.length && !loading" @select-tier="handleCreateListing" />

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
      <OrganismsDashboardNoResults v-else type="listings" />

      <!-- Pagination -->
      <div v-if="pageTotal > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="pageTotal" :items-per-page="limit"
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
    title: "Your Listings",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums';

const { user } = useUserSession()
const { listings, total } = useMyListings()
const requestFetch = useRequestFetch()

const pageTop = ref<HTMLElement | null>(null)
const page = ref(1)
const limit = 20

const listingModal = ref<{ openForNewListing: (tier: any) => void; openForDraft: (id: number) => Promise<void>; openForListing: (id: number) => Promise<void> } | null>(null)

const { sortOrderValue, searchQuery, saleRentFilter } = useDashboardListFilter(ref([]), {
  persistenceKey: "dashboard-my-listings",
  hideListingSort: true,
})

const mapSortOrder = computed(() => sortOrderValue.value === "newest" ? "new" : "old")

// Reset to page 1 when filters change
watch([saleRentFilter, mapSortOrder], () => { page.value = 1 })

// Return data so it's serialized in SSR payload and available during hydration
const { data: fetchedData, pending: loading, refresh } = useAsyncData(
  () => `my-listings:${user.value?.id}:${saleRentFilter.value}:${mapSortOrder.value}:${page.value}`,
  () => requestFetch<{ listings: OwnedListingWithAnalytics[]; total: number }>(
    `/api/user/my-listings/?status=all&sort=${mapSortOrder.value}&page=${page.value}&take=${limit}&saleRent=${saleRentFilter.value}`
  ),
  { server: true }
)

// SSR-safe derived data (serialized in Nuxt payload, available immediately on hydration)
const pageListings = computed(() => fetchedData.value?.listings ?? [])
const pageTotal = computed(() => fetchedData.value?.total ?? 0)

// Sync to shared composable for external consumers (actions, other components)
watch(pageListings, (items) => { listings.value = items }, { immediate: true })
watch(pageTotal, (t) => { total.value = t }, { immediate: true })

function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier)
}

async function onPageChange(newPage: number) {
  page.value = newPage
  const el = (pageTop.value as any)?.$el ?? pageTop.value
  const scrollContainer = el?.closest(".overflow-y-auto, .overflow-y-scroll, .overflow-auto")
  scrollContainer?.scrollTo({ top: 0, behavior: "smooth" })
}

async function handleEditListing(payload: { id: number; isDraft: boolean }) {
  if (payload.isDraft) {
    await listingModal.value?.openForDraft(payload.id)
  } else {
    await listingModal.value?.openForListing(payload.id)
  }
}

function handleModalClose() {
  refresh()
}

// Client-side search filter applied on top of SSR-safe data
const filteredListings = ref<OwnedListingWithAnalytics[]>([])

watch([pageListings, searchQuery], () => {
  let filtered = pageListings.value
  if (searchQuery.value) {
    const term = searchQuery.value.toLowerCase()
    filtered = filtered.filter((item) =>
      item.property?.address?.fullAddress?.toLowerCase().includes(term) ||
      item.price?.toString().includes(term)
    )
  }
  filteredListings.value = filtered
}, { immediate: true })
</script>
