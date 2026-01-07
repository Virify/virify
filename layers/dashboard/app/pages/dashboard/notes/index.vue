<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="($route.meta.head as any)?.title || 'Your Notes'"
        :icon="($route.meta.head as any)?.icon || 'i-lucide-sticky-note'"
        class="body-sm border-0"
        :ui="{
          icon: 'text-secondary'
        }"
      />
    </template>

    <template #body>
      <OrganismsDashboardListingGrid v-if="filteredUserNotes.length > 0">
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
  const { filteredUserNotes } = useNotes()
</script>