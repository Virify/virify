<template>
  <OrganismsDashboardListingGrid v-if="userNotes.length > 0">
    <div v-for="item in userNotes" :key="item.listing?.id" class="h-full">
      <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
    </div>
  </OrganismsDashboardListingGrid>
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