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
          <OrganismsDashboardFilterListings :items="viewedListings" :date-key="'createdAt'"
            persistence-key="dashboard-viewed" @update:filtered="filteredViewed = $event">
            <template #extra-filters>
              <USelect v-model="period" :items="periodOptions" option-attribute="label" value-attribute="value"
                icon="i-lucide-calendar-days" color="primary" variant="ghost" size="md" class="body-sm w-full" :ui="{
                  base: 'capitalize cursor-pointer light:bg-(--blue-400)! light:text-white!',
                  content: 'z-[60]!',
                  group: 'bg-(--blue-100) text-(--foreground-100) p-1',
                  item: 'hover:bg-(--background-200)',
                }" trailing-icon="i-lucide-chevron-down" />
            </template>
          </OrganismsDashboardFilterListings>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>

      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredViewed.length > 0">
        <div v-for="item in filteredViewed" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :viewed="item.createdAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else :description="'No viewed listings found.'" />

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
    title: "Viewed Listings",
    icon: 'i-lucide-eye',
  },
  layout: "dashboard",
});

const { user } = useUserSession()
const { setGroups } = useDashboardSearch()
const requestFetch = useRequestFetch()

const page = ref(1)
const limit = 20
const pageTop = ref<HTMLElement | null>(null)
const filteredViewed = ref<RecentlyViewed[]>([])

const period = useCookie<'30' | '60' | 'all'>('dashboard-viewed-period', {
  default: () => '30',
  maxAge: 60 * 60 * 24 * 365,
})

const periodOptions = [
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 60 days', value: '60' },
  { label: 'All time', value: 'all' },
]

const { saleRentFilter, sortOrderValue } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-viewed' })

// Reset to page 1 when filters change
watch([saleRentFilter, sortOrderValue, period], () => { page.value = 1 })

const { data, pending: loading } = useAsyncData(
  () => `viewed:${user.value?.id}:${saleRentFilter.value}:${sortOrderValue.value}:${period.value}:${page.value}`,
  () => requestFetch<{ viewedListings: RecentlyViewed[]; total: number }>(
    `/api/user/viewed/all/full?filter=${saleRentFilter.value}&sort=${sortOrderValue.value}&period=${period.value}&page=${page.value}&limit=${limit}`
  ),
  { server: true }
)

const viewedListings = computed(() => data.value?.viewedListings ?? [])
const total = computed(() => data.value?.total ?? 0)

function onPageChange(newPage: number) {
  page.value = newPage
  const el = (pageTop.value as any)?.$el ?? pageTop.value
  const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(viewedListings, (items) => {
  filteredViewed.value = items
  setGroups(generateDashboardSearchGroups(items, 'viewed'))
}, { immediate: true })
</script>
