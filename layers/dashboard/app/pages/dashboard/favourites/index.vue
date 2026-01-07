<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-5">
    <div v-for="item in favourites" :key="item.listing?.id" class="h-full">
      <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
    </div>
  </div>
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