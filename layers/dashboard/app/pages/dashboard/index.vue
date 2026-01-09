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
      <OrganismsDashboardAnalyticsCard />
      <!-- https://github.com/nuxt/ui/issues/5529 -->
      <UAccordion 
        :items="accordionItems" 
        default-value="favourite-listings" 
        :ui="{
          leadingIcon: 'text-secondary',
          label: 'body-sm font-bold',
        }"
      >
        <template #favourite-listings>
          <OrganismsDashboardListingCardGrid v-if="isFavouritesLoading">
            <OrganismsDashboardListingCardSkeleton :cards="3"/>
          </OrganismsDashboardListingCardGrid>
          <OrganismsDashboardListingCardGrid v-else-if="recentFavourites.length > 0">
            <div v-for="item in recentFavourites" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" :fav="item.createdAt" />
            </div>
          </OrganismsDashboardListingCardGrid>
          <div v-else>
            <p class="body-sm">You have no recent favourite listings.</p>
          </div>
        </template>

        <template #notes-added>
          <OrganismsDashboardListingCardGrid v-if="isNotesLoading">
            <OrganismsDashboardListingCardSkeleton :cards="3"/>
          </OrganismsDashboardListingCardGrid>
          <OrganismsDashboardListingCardGrid v-else>
            <div v-for="item in recentUserNotes" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" :note="item.updatedAt" />
            </div>
          </OrganismsDashboardListingCardGrid>
        </template>
        
        <template #viewed-listings>
          <OrganismsDashboardListingCardGrid v-if="isAnalyticsLoading">
            <OrganismsDashboardListingCardSkeleton :cards="3"/>
          </OrganismsDashboardListingCardGrid>
          <OrganismsDashboardListingCardGrid v-else-if="recentlyViewedListings.length > 0">
            <div v-for="item in recentlyViewedListings" :key="item.listing?.id" class="h-full">
              <OrganismsDashboardListingCard :listing="item.listing!" />
            </div>
          </OrganismsDashboardListingCardGrid>
          <p v-else class="body-sm">No recently viewed listings.</p>
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

const { recentlyViewedListings, isAnalyticsLoading } = useAnalytics()
const { recentFavourites, isLoading: isFavouritesLoading } = useFavourites()
const { recentUserNotes, isLoading: isNotesLoading } = useNotes()


const accordionItems: AccordionItem[] = [
  {
    id: useId(),
    label: 'Recent Favourite Listings',
    icon: 'i-lucide-heart',
    slot: 'favourite-listings',
    value: 'favourite-listings',
  },
  {
    id: useId(),
    label: 'Recent Notes Added',
    icon: 'i-lucide-sticky-note',
    slot: 'notes-added',
    value: 'notes-added',
  },
  {
    id: useId(),
    label: 'Viewed Listings',
    icon: 'i-lucide-eye',
    slot: 'viewed-listings',
    value: 'viewed-listings',
  },
];
</script>