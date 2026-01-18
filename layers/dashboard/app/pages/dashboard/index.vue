<template>
  <UDashboardPanel id="dashboard-home-panel">
    <template #header>
      <UDashboardNavbar
        :title="'Welcome back, ' + (user?.username || user?.email) + '!'"
        toggle-side="left"
        class="border-0"
        :ui="{
          title: 'title-sm m-0!',
        }"
      >
        <template #right>
          <OrganismsDashboardNotificationButton />
        </template>
      </UDashboardNavbar>
      <MoleculesDashboardPasswordAlert />
    </template>

    <template #body>
      <MoleculesDashboardPriceTier @select-tier="handleCreateListing" />
      <h2 class="title-xs mb-0! flex items-center gap-2">
        Quick analytics
        <UIcon name="i-lucide-bar-chart-3" class="text-secondary" />
      </h2>
      <OrganismsDashboardAnalyticsCard />

      <!-- Quick Actions Grid -->
      <h2 class="title-xs mb-0! flex items-center gap-2">
        Quick actions
        <UIcon name="i-lucide-rocket" class="text-secondary" />
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UPageCard
          title="My Favourites"
          description="View and manage your saved properties"
          icon="i-lucide-heart"
          to="/dashboard/favourites"
          spotlight
          spotlight-color="secondary"
          variant="subtle"
          :ui="{
            leadingIcon: 'text-secondary',
            title: 'body-sm font-bold',
            description: 'text-muted-foreground body-xs',
            container: 'border border-secondary rounded-lg',
          }"
        />
        <UPageCard
          title="My Notes"
          description="Review your property notes and annotations"
          icon="i-lucide-sticky-note"
          to="/dashboard/notes"
          spotlight
          spotlight-color="secondary"
          variant="subtle"
          :ui="{
            leadingIcon: 'text-secondary',
            title: 'body-sm font-bold',
            description: 'text-muted-foreground body-xs',
            container: 'border border-secondary rounded-lg',
          }"
        />
        <UPageCard
          title="Search Properties"
          description="Find your perfect home with our search tools"
          icon="i-lucide-search"
          spotlight
          spotlight-color="secondary"
          to="/search"
          variant="subtle"
          :ui="{
            leadingIcon: 'text-secondary',
            title: 'body-sm font-bold',
            description: 'text-muted-foreground body-xs',
            container: 'border border-secondary rounded-lg',
          }"
        />
        <UPageCard
          title="My Enquiries"
          description="Track your property enquiries and responses"
          icon="i-lucide-mail"
          to="/dashboard/enquiries"
          spotlight
          spotlight-color="secondary"
          variant="subtle"
          :ui="{
            leadingIcon: 'text-secondary',
            title: 'body-sm font-bold',
            description: 'text-muted-foreground body-xs',
            container: 'border border-secondary rounded-lg',
          }"
        />
      </div>

      <ClientOnly>
        <UAccordion
          :items="accordionItems"
          type="multiple"
          default-values="['favourite-listings']"
          :ui="{
            leadingIcon: 'text-secondary',
            label: 'body-sm font-bold',
          }"
        >
          <template #favourite-listings>
            <OrganismsDashboardListingCardCarousel :items="recentFavourites" :loading="isFavouritesLoading" type="favourites" empty-message="You have no recent favourite listings." />
          </template>

          <template #notes-added>
            <OrganismsDashboardListingCardCarousel :items="recentUserNotes" :loading="isNotesLoading" type="notes" empty-message="You have no recent notes." />
          </template>

          <template #viewed-listings>
            <OrganismsDashboardListingCardCarousel :items="recentlyViewedListings" :loading="isAnalyticsLoading" type="viewed" empty-message="You have no recent viewed listings." />
          </template>
        </UAccordion>
      </ClientOnly>
      
      <!-- Shared Listing Editor Modal -->
      <OrganismsDashboardCreateListingModal ref="listingModal" />
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
import type { AccordionItem } from "@nuxt/ui";
import type { ListingTier } from '~~/layers/database/server/database/prisma/generated/enums'
import OrganismsDashboardCreateListingModal from '~~/layers/dashboard/app/components/Organisms/Dashboard/CreateListing/OrganismsDashboardCreateListingModal.vue';

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Home",
    icon: "i-lucide-home",
  },
  layout: "dashboard",
});

const { user } = useUserSession();

// Modal ref for creating listings
const listingModal = ref<InstanceType<typeof OrganismsDashboardCreateListingModal> | null>(null);

function handleCreateListing(tier: ListingTier) {
  listingModal.value?.openForNewListing(tier);
}

// Get all recent data from useAnalytics (centralized dashboard data)
const { recentlyViewedListings, recentFavourites, recentUserNotes, recentFavouritesStatus, recentNotesStatus, isAnalyticsLoading } = useAnalytics();

// Computed loading states from statuses
const isFavouritesLoading = computed(() => recentFavouritesStatus.value === "pending");
const isNotesLoading = computed(() => recentNotesStatus.value === "pending");

const accordionItems: AccordionItem[] = [
  {
    label: "Recent Favourite Listings",
    icon: "i-lucide-heart",
    slot: "favourite-listings",
    value: "favourite-listings",
  },
  {
    label: "Recent Notes Added",
    icon: "i-lucide-sticky-note",
    slot: "notes-added",
    value: "notes-added",
  },
  {
    label: "Viewed Listings",
    icon: "i-lucide-eye",
    slot: "viewed-listings",
    value: "viewed-listings",
  },
];
</script>
