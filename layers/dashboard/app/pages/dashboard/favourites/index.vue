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
      >
      <template #right>
        <UDashboardSearchButton color="neutral" variant="outline" class="w-full" />
      </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <OrganismsDashboardListingGrid v-if="favourites.length > 0">
        <div v-for="item in favourites" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingGrid>
      <div v-else class="text-center text-gray-500 py-8">
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

const { favourites } = useFavourites()
</script>