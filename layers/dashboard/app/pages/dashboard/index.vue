<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar
        :title="'Welcome back, ' + (user?.username || user?.email) + '!'"
        toggle-side="left"
        class="border-0"
        :ui="{
          title: 'title-sm m-0!',
        }"
      />
    </template>

    <template #body>
      <OrganismsDashboardAnalyticsCard />

      <UAccordion 
        :items="accordionItems" 
        default-value="favourite-listings" 
        :ui="{
          leadingIcon: 'text-secondary',
          label: 'body-sm font-bold',
        }"
      >
        <template #favourite-listings>
          <OrganismsDashboardListingCardCarousel
            :items="recentFavourites"
            :loading="isFavouritesLoading"
            type="favourites"
            empty-message="You have no recent favourite listings."
          />
        </template>

        <template #notes-added>
          <OrganismsDashboardListingCardCarousel
            :items="recentUserNotes"
            :loading="isNotesLoading"
            type="notes"
            empty-message="You have no recent notes."
          />
        </template>
        
        <template #viewed-listings>
          <OrganismsDashboardListingCardCarousel
            :items="recentlyViewedListings"
            :loading="isAnalyticsLoading"
            type="viewed"
            empty-message="You have no recent viewed listings."
          />
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

  const { user } = useUserSession()
  // Get all recent data from useAnalytics (centralized dashboard data)
  const { 
    recentlyViewedListings, 
    recentFavourites, 
    recentUserNotes,
    isAnalyticsLoading 
  } = useAnalytics()
  // Get loading states from individual composables
  const { isLoading: isFavouritesLoading } = useFavourites()
  const { isLoading: isNotesLoading } = useNotes()

  const accordionItems: AccordionItem[] = [
    {
      label: 'Recent Favourite Listings',
      icon: 'i-lucide-heart',
      slot: 'favourite-listings',
      value: 'favourite-listings',
      defaultValue: true,
    },
    {
      label: 'Recent Notes Added',
      icon: 'i-lucide-sticky-note',
      slot: 'notes-added',
      value: 'notes-added',
      defaultValue: true,
    },
    {
      label: 'Viewed Listings',
      icon: 'i-lucide-eye',
      slot: 'viewed-listings',
      value: 'viewed-listings',
      defaultValue: true,
    },
  ];
</script>