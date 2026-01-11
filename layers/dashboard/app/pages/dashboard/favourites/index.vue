<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Your Favourites" class="body-sm border-0 px-3" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
      }">
        <template #right>
          <OrganismsDashboardFilter
            ref="filterRef"
            :items="favourites"
            :date-key="'createdAt'"
            persistence-key="dashboard-favourites"
            @update:filtered="filteredFavourites = $event"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3"/>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredFavourites.length > 0">
        <div v-for="item in filteredFavourites" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else :description="'No Favourites found.'" />

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination :v-model:page="page" @update:page="onPageChange" :total="total" :page-count="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
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

  const { favourites, fetchFavourites, total, loading } = useFavourites()
  const { setGroups } = useDashboardSearch()
  
  const filterRef = ref()
  const page = ref(1)
  const limit = ref(20)
  const pageTop = ref<HTMLElement | null>(null)
  const filteredFavourites = ref<UserFavouriteListingCard[]>([])

  const { 
    saleRentFilter,
    sortOrderValue,
  } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-favourites' })

  // Watch filter changes and re-fetch from API (reset to page 1)
  watch([saleRentFilter, sortOrderValue], async () => {
    page.value = 1
    await fetchFavourites(saleRentFilter.value, 1, sortOrderValue.value, limit.value)
  }, { immediate: true })

  // Handle page changes from pagination component
  async function onPageChange(newPage: number) {
    page.value = newPage
    await fetchFavourites(saleRentFilter.value, newPage, sortOrderValue.value, limit.value)

    const el = (pageTop.value as any)?.$el ?? pageTop.value
    const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  watch(favourites, () => {
    setGroups(generateDashboardSearchGroups(favourites.value, 'favourites'))
  }, { immediate: true })
</script>