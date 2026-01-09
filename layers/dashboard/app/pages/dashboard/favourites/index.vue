<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Your Favourites" class="body-sm border-0 px-3" :ui="{
        title: 'title-sm m-0!',
        icon: 'text-secondary',
      }">
        <template #right>
          <OrganismsDashboardFilter
            :items="favourites"
            :date-key="'createdAt'"
            @update:filtered="favouritesFiltered = $event"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <OrganismsDashboardListingCardGrid v-if="isLoading">
        <OrganismsDashboardListingCardSkeleton :cards="3"/>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardListingCardGrid v-else-if="favouritesFiltered.length > 0">
        <div v-for="item in favouritesFiltered" :key="item.listing?.id" class="h-full">
          <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
        </div>
      </OrganismsDashboardListingCardGrid>
      <OrganismsDashboardNoResults v-else :description="'No favourites found matching your criteria.'" />
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