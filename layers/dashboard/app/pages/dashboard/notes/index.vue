<template>
  <UDashboardPanel>
    <template #header>
      <OrganismsNavigationSearch :title="'Your Notes'" />
    </template>

    <template #body>
      <OrganismsDashboardListingGrid v-if="isLoading">
        <OrganismsSkeletonListingCardDashboard :cards="3"/>
      </OrganismsDashboardListingGrid>
      <OrganismsDashboardListingGrid v-else-if="filteredUserNotes.length > 0">
        <div v-for="item in filteredUserNotes" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
        </div>
      </OrganismsDashboardListingGrid>
      <div v-else class="text-center text-gray-500 py-8">
        No notes found matching your criteria.
      </div>
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
  definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Your Notes",
    icon: 'i-lucide-sticky-note',
  },
  layout: "dashboard",
});
  const { userNotes, filteredUserNotes, isLoading } = useNotes()
  const { setGroups } = useDashboardSearch()

  watch(userNotes, () => {
    setGroups(generateDashboardSearchGroups(userNotes.value, 'notes'))
  }, { immediate: true, deep: true })
</script>