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
          <OrganismsDashboardFilter
            :items="hiddenListings"
            :date-key="'hiddenAt'"
            persistence-key="dashboard-hidden-listings"
            @update:filtered="filteredHiddenListings = $event"
          />
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
          <OrganismsDashboardListingCardHidden
            :listing="item.listing!"
            :hidden-at="item.hiddenAt"
            :reason="item.reason"
            @unhide="removeHiddenListing"
          />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else :description="'No Hidden Listings found.'" />

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination
          v-model:page="page"
          @update:page="onPageChange"
          :total="total"
          :items-per-page="limit"
          variant="ghost"
          active-color="secondary"
          color="secondary"
          size="md"
          class="body-sm"
        />
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

  const { hiddenListings, fetchHiddenListings, total, loading } = useHiddenListings()

  const page = ref(1)
  const limit = ref(20)
  const pageTop = ref<HTMLElement | null>(null)
  const filteredHiddenListings = ref<UserHiddenListingCard[]>([])

  const {
    saleRentFilter,
    sortOrderValue,
  } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-hidden-listings' })

  // Watch filter changes and re-fetch from API (reset to page 1)
  watch([saleRentFilter, sortOrderValue], async () => {
    page.value = 1
    const validSortOrder = sortOrderValue.value === 'newest' || sortOrderValue.value === 'oldest' ? sortOrderValue.value : undefined
    await fetchHiddenListings(saleRentFilter.value, 1, validSortOrder, limit.value)
  }, { immediate: true })

  // Handle page changes from pagination component
  async function onPageChange(newPage: number) {
    page.value = newPage
    const validSortOrder = sortOrderValue.value === 'newest' || sortOrderValue.value === 'oldest' ? sortOrderValue.value : undefined
    await fetchHiddenListings(saleRentFilter.value, newPage, validSortOrder, limit.value)

    const el = (pageTop.value as any)?.$el ?? pageTop.value
    const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Remove a listing immediately when the user unhides it
  function removeHiddenListing(listingId: number) {
    hiddenListings.value = hiddenListings.value.filter(item => item.listing?.id !== listingId)
    filteredHiddenListings.value = filteredHiddenListings.value.filter(item => item.listing?.id !== listingId)
    total.value = Math.max(0, total.value - 1)
  }
</script>
