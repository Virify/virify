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
          <OrganismsDashboardFilterListings
            :items="userNotes"
            :date-key="'updatedAt'"
            persistence-key="dashboard-notes"
            @update:filtered="filteredUserNotes = $event"
          />
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-if="loading">
        <OrganismsDashboardListingCardSkeleton :cards="3"/>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid ref="pageTop" v-else-if="filteredUserNotes.length > 0">
        <div v-for="item in filteredUserNotes" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
        </div>
      </OrganismsDashboardListingCardGrid> 
      <OrganismsDashboardNoResults v-else :description="'No Notes found.'" />

      <div v-if="total > 0" class="flex justify-center p-4 mt-auto">
        <UPagination v-model:page="page" @update:page="onPageChange" :total="total" :items-per-page="limit" variant="ghost" active-color="secondary" color="secondary" size="md" class="body-sm" />
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

  const { userNotes, fetchNotes, total, loading } = useNotes()
  const { setGroups } = useDashboardSearch()
  
  const page = ref(1)
  const limit = ref(20)
  const pageTop = ref<HTMLElement | null>(null)
  const filteredUserNotes = ref<NoteData[]>([])

  const { 
    saleRentFilter,
    sortOrderValue,
  } = useDashboardListFilter(ref([]), { persistenceKey: 'dashboard-notes' })

  // Watch filter changes and re-fetch from API (reset to page 1)
  watch([saleRentFilter, sortOrderValue], async () => {
    page.value = 1
    const validSortOrder = sortOrderValue.value === 'newest' || sortOrderValue.value === 'oldest' ? sortOrderValue.value : undefined
    await fetchNotes(saleRentFilter.value, 1, validSortOrder, limit.value)
  }, { immediate: true })

  // Handle page changes from pagination component
  async function onPageChange(newPage: number) {
    page.value = newPage
    const validSortOrder = sortOrderValue.value === 'newest' || sortOrderValue.value === 'oldest' ? sortOrderValue.value : undefined
    await fetchNotes(saleRentFilter.value, newPage, validSortOrder, limit.value)

    const el = (pageTop.value as any)?.$el ?? pageTop.value
    const scrollContainer = el?.closest('.overflow-y-auto, .overflow-y-scroll, .overflow-auto')
    scrollContainer?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  watch(userNotes, () => {
    setGroups(generateDashboardSearchGroups(userNotes.value, 'notes'))
  }, { immediate: true, deep: true })
</script>