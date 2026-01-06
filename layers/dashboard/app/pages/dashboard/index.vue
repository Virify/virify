<template>
  <OrganismsAnalyticsCard />
  <UAccordion :items="accordionItems" :ui="{
    leadingIcon: 'text-secondary',
    label: 'body-sm',
  }">
    <template #favourite-listings>
      <UPageCard v-for="item in recentFavourites" :key="item.id" title="Favourited Listings" description="test decription" variant="soft" class="my-2" />
    </template>
    
    <template #viewed-listings>
      <p>Viewed Listings</p>
    </template>
  </UAccordion>
</template>
<script lang="ts" setup>
import type { AccordionItem } from '@nuxt/ui';

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Home",
    icon: 'i-lucide-home',
  },
  layout: "dashboard",
});

const { recentlyViewedListings } = useAnalytics()
const { recentFavourites } = useFavourites()
const accordionItems: AccordionItem[] = [
    {
      label: 'Recent Favourite Listings',
      icon: 'i-lucide-heart',
      slot: 'favourite-listings',
      value: 'favourite-listings',
    },
    {
      label: 'Viewed Listings',
      icon: 'i-lucide-eye',
      slot: 'viewed-listings',
      value: 'viewed-listings',
    },
    {
      label: 'Notes Added',
      icon: 'i-lucide-sticky-note',
      value: 'notes-added',
    },
]

console.log(recentlyViewedListings.value)
</script>