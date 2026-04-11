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
          <OrganismsDashboardFilterListings :items="favourites" :date-key="'createdAt'"
            persistence-key="dashboard-favourites" hide-availability-filter listing-date-sort
            @update:filtered="filteredFavourites = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>

      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredFavourites.length > 0">
        <div v-for="item in filteredFavourites" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else type="favourites" />

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
    title: "Your Favourites",
    icon: 'i-lucide-heart',
  },
  layout: "dashboard",
});

const { user } = useUserSession()
const { setGroups } = useDashboardSearch()
const requestFetch = useRequestFetch()

const page = ref(1)
const limit = 20
const pageTop = ref<HTMLElement | null>(null)
const filteredFavourites = ref<UserFavouriteListingCard[]>([])

const { saleRentFilter, sortOrderValue } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-favourites', listingDateSort: true })

// Reset to page 1 when filters change
watch([saleRentFilter, sortOrderValue], () => { page.value = 1 })

const { data, pending: loading } = useAsyncData(
  () => `favs:${user.value?.id}:${saleRentFilter.value}:${sortOrderValue.value}:${page.value}`,
  () => requestFetch<{ favourites: UserFavouriteListingCard[]; total: number }>(
    `/api/user/favourites/all/full?filter=${saleRentFilter.value}&sort=${sortOrderValue.value}&page=${page.value}&limit=${limit}`
  ),
  { server: true }
)

const favourites = computed(() => data.value?.favourites ?? [])
const total = computed(() => data.value?.total ?? 0)

function onPageChange(newPage: number) {
  page.value = newPage
  const el = (pageTop.value as any)?.$el ?? pageTop.value
  const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(favourites, (favs) => {
  filteredFavourites.value = favs
  setGroups(generateDashboardSearchGroups(favs, 'favourites'))
}, { immediate: true })
</script>