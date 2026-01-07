<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-5">
    <div v-for="item in userNotes" :key="item.listing?.id" class="h-full">
      <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
    </div>
  </div>
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
  const { userNotes } = useNotes()
</script>