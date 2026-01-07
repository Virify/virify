<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="($route.meta.head as any)?.title || 'Dashboard'"
        :icon="($route.meta.head as any)?.icon"
        toggle-side="right"
        class="body-sm border-0"
        :ui="{
          icon: 'text-secondary',
          title: 'font-bold',
        }"
      />
    </template>

    <template #body>
      <OrganismsAnalyticsCard />
      <UAccordion 
        :items="accordionItems" 
        default-value="favourite-listings" 
        :ui="{
          leadingIcon: 'text-secondary',
          label: 'body-sm font-bold',
        }"
      >
        <template #favourite-listings>
          <OrganismsDashboardListingGrid v-if="recentFavourites.length > 0">
            <div v-for="item in recentFavourites" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
            </div>
          </OrganismsDashboardListingGrid>
          <div v-else>
            <p class="body-sm">You have no recent favourite listings.</p>
          </div>
        </template>

        <template #notes-added>
          <OrganismsDashboardListingGrid v-if="recentUserNotes.length > 0">
            <div v-for="item in recentUserNotes" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
            </div>
          </OrganismsDashboardListingGrid>
          <div v-else>
            <p class="body-sm">No recent Notes added.</p>
          </div>
        </template>
        
        <template #viewed-listings>
          <OrganismsDashboardListingGrid v-if="recentlyViewedListings.length > 0">
            <div v-for="item in recentlyViewedListings" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" />
            </div>
          </OrganismsDashboardListingGrid>
          <p class="body-sm">No recently viewed listings.</p>
        </template>
      </UAccordion>
    </template>
  </UDashboardPanel>
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
const { recentUserNotes } = useNotes()

console.log(recentUserNotes.value)


const accordionItems: AccordionItem[] = [
  {
    label: 'Recent Favourite Listings',
    icon: 'i-lucide-heart',
    slot: 'favourite-listings',
    value: 'favourite-listings',
  },
  {
    label: 'Recent Notes Added',
    icon: 'i-lucide-sticky-note',
    slot: 'notes-added',
    value: 'notes-added',
  },
  {
    label: 'Viewed Listings',
    icon: 'i-lucide-eye',
    slot: 'viewed-listings',
    value: 'viewed-listings',
  },
];
</script>