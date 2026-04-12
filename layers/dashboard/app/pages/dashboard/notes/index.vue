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
          <OrganismsDashboardFilterListings :items="userNotes" :date-key="'updatedAt'" persistence-key="dashboard-notes"
            hide-availability-filter listing-date-sort
            @update:filtered="filteredUserNotes = $event" />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3" />
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredUserNotes.length > 0">
        <div v-for="item in filteredUserNotes" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else type="notes" />

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit"
          variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
      </div>
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
import type { NoteData } from '~~/shared/types/note'

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Notes",
    icon: 'i-lucide-sticky-note',
  },
  layout: "dashboard",
});

const { user } = useUserSession()
const { setGroups } = useDashboardSearch()
const requestFetch = useRequestFetch()

const page = ref(1)
const limit = 20
const pageTop = ref<HTMLElement | null>(null)
const filteredUserNotes = ref<NoteData[]>([])

const { saleRentFilter, sortOrderValue } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-notes', listingDateSort: true })

// Reset to page 1 when filters change
watch([saleRentFilter, sortOrderValue], () => { page.value = 1 })

const { data, pending: loading } = useAsyncData(
  () => `notes:${user.value?.id}:${saleRentFilter.value}:${sortOrderValue.value}:${page.value}`,
  () => requestFetch<{ notes: NoteData[]; total: number }>(
    `/api/user/notes/all/full?filter=${saleRentFilter.value}&sort=${sortOrderValue.value}&page=${page.value}&limit=${limit}`
  ),
  { server: true }
)

const userNotes = computed(() => data.value?.notes ?? [])
const total = computed(() => data.value?.total ?? 0)

function onPageChange(newPage: number) {
  page.value = newPage
  const el = (pageTop.value as any)?.$el ?? pageTop.value
  const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
  scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(userNotes, (notes) => {
  filteredUserNotes.value = notes
  setGroups(generateDashboardSearchGroups(notes, 'notes'))
}, { immediate: true })
</script>