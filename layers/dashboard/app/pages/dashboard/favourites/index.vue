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
      <OrganismsDashboardFilter
        :items="favourites"
        :date-key="'createdAt'"
        @update:filtered="favouritesFiltered = $event"
      />
      <OrganismsDashboardListingCardGrid v-if="isLoading">
        <OrganismsDashboardListingCardSkeleton :cards="3"/>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid v-else-if="favourites.length > 0">
        <div v-for="item in favouritesFiltered" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
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
const favouritesFiltered = ref<typeof favourites.value>([])

watch(favourites, () => {
  setGroups(generateDashboardSearchGroups(favourites.value, 'favourites'))
}, { immediate: true })
</script>