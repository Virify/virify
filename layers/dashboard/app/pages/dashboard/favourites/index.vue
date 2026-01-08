<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="($route.meta.head as any)?.title || 'Your Notes'"
        class="body-sm border-0"
        :ui="{
          title: 'title-sm m-0!',
          icon: 'text-secondary',
        }"
      >
        <template #right>
          <UDashboardSearchButton color="neutral" variant="outline" block class="w-full!" label="Search..." />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex gap-2 shrink-0 body-sm">
        <USelect v-model="saleRentFilter" :items="saleRentOptions" :highlight="false" color="secondary" size="lg" />
        <USelect v-model="sortOrderValue" :items="sortOrder" :highlight="false" color="secondary" size="lg" />
      </div>
      <OrganismsDashboardListingGrid v-if="isLoading">
        <OrganismsSkeletonListingCardDashboard :cards="3"/>
      </OrganismsDashboardListingGrid>
      <OrganismsDashboardListingGrid v-else-if="favourites.length > 0">
        <div v-for="item in favouritesFiltered" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingGrid>
      <div v-else class="text-center">
        No favourites found matching your criteria.

      </div>
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
  definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Favourites",
    icon: 'i-lucide-heart',
  },
  layout: "dashboard",
});

const { favourites, isLoading } = useFavourites()
const { setGroups } = useDashboardSearch()
const sortOrderValue = ref('Newest')
const saleRentFilter = ref('All')

const sortOrder = ref([
  'Newest',
  'Oldest',
])

const saleRentOptions = ref([
  'All',
  'Sale',
  'Rent',
])

const appliedFilters = computed(() => {
  return {
    sortOrder: sortOrderValue.value,
    saleRent: saleRentFilter.value,
  }
})

const favouritesFiltered = computed(() => {
  // Start with a copy to avoid mutating the original array
  let filtered = [...favourites.value]

  // Filter by Sale/Rent
  if (appliedFilters.value.saleRent === 'Sale') {
    filtered = filtered.filter(fav => fav.listing?.saleListing)
  } else if (appliedFilters.value.saleRent === 'Rent') {
    filtered = filtered.filter(fav => fav.listing?.rentalListing)
  }

  // Sort by date
  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    
    return appliedFilters.value.sortOrder === 'Newest' 
      ? dateB - dateA 
      : dateA - dateB
  })

  return filtered
})

watch(favourites, () => {
  setGroups(generateDashboardSearchGroups(favourites.value, 'favourites'))
}, { immediate: true })
</script>