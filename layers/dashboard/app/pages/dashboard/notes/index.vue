<template>
  <UDashboardPanel>
    <template #header>
      <OrganismsDashboardNavigationSearch :title="'Your Notes'" />
    </template>

    <template #body>
      <OrganismsDashboardFilter
        :items="userNotes"
        :date-key="'updatedAt'"
        @update:filtered="filteredUserNotes = $event"
      />
      <OrganismsDashboardListingCardGrid v-if="isLoading">
        <OrganismsDashboardListingCardSkeleton :cards="3"/>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid v-else-if="filteredUserNotes.length > 0">
        <div v-for="item in filteredUserNotes" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
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
  const { userNotes, isLoading } = useNotes()
  const { setGroups } = useDashboardSearch()
  
  const filteredUserNotes = ref<typeof userNotes.value>([])

  watch(userNotes, () => {
    setGroups(generateDashboardSearchGroups(userNotes.value, 'notes'))
  }, { immediate: true, deep: true })
</script>