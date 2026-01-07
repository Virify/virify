<template>
  <OrganismsDashboardListingGrid v-if="favourites.length > 0">
    <div v-for="item in favourites" :key="item.listing?.id" class="h-full">
      <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
    </div>
  </OrganismsDashboardListingGrid>
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