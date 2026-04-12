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
          <OrganismsDashboardFilterListings :items="hiddenListings" :date-key="'hiddenAt'"
            persistence-key="dashboard-hidden-listings" @update:filtered="filteredHiddenListings = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>

      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredHiddenListings.length > 0">
        <div v-for="item in filteredHiddenListings" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCardHidden :listing="item.listing!" :hidden-at="item.hiddenAt" :reason="item.reason"
            @unhide="removeHiddenListing" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else type="hidden listings" />

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit"
          variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Hidden Listings",
    icon: 'i-lucide-eye-off',
  },
  layout: "dashboard",
});

const { user } = useUserSession()
const requestFetch = useRequestFetch()

const page = ref(1)
const limit = 20
const pageTop = ref<HTMLElement | null>(null)
const filteredHiddenListings = ref<UserHiddenListingCard[]>([])

const { saleRentFilter, sortOrderValue } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-hidden-listings' })

// Reset to page 1 when filters change
watch([saleRentFilter, sortOrderValue], () => { page.value = 1 })

const { data, pending: loading, refresh } = useAsyncData(
  () => `hidden:${user.value?.id}:${saleRentFilter.value}:${sortOrderValue.value}:${page.value}`,
  () => requestFetch<{ hiddenListings: UserHiddenListingCard[]; total: number }>(
    `/api/user/hidden-listings/all/full?filter=${saleRentFilter.value}&sort=${sortOrderValue.value}&page=${page.value}&limit=${limit}`
  ),
  { server: true }
)

const hiddenListings = computed(() => data.value?.hiddenListings ?? [])
const total = computed(() => data.value?.total ?? 0)

function onPageChange(newPage: number) {
  page.value = newPage
  const el = (pageTop.value as any)?.$el ?? pageTop.value
  const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
}

// Seed filteredHiddenListings so SSR and client start with the same state
watch(hiddenListings, (listings) => {
  filteredHiddenListings.value = listings
}, { immediate: true })

// Refresh list when the user unhides a listing
function removeHiddenListing(_listingId: number) {
  refresh()
}
</script>
