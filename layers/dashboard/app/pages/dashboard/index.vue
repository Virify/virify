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
      <!-- Quick Actions Grid -->
      <h2 class="title-xs mb-0! flex items-center gap-2">
        Quick actions
        <UIcon
          name="i-lucide-rocket"
          class="text-secondary"
        />
      </h2>

      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UPageCard
          title="My Listings"
          description="View and manage your saved listings"
          icon="i-lucide-library"
          to="/dashboard/my-listings"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          title="Create a Listing"
          description="Create a listing to showcase your property"
          icon="i-lucide-plus"
          :to="
            !(isAdmin || (createListing && (isAgent || isUser))) ?
              undefined
            : '/dashboard/create-listing'
          "
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :class="{
            cursor:
              !(isAdmin || (createListing && (isAgent || isUser))) ?
                'not-allowed'
              : 'pointer',
          }"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          title="My Favourites"
          description="View and manage your favourite properties"
          icon="i-lucide-heart"
          to="/dashboard/favourites"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          title="My Notes"
          description="Review your property notes and annotations"
          icon="i-lucide-sticky-note"
          to="/dashboard/notes"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          title="My Viewings"
          description="Manage your upcoming property viewings"
          icon="i-lucide-calendar-check"
          to="/dashboard/viewings"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
        <UPageCard
          title="My Enquiries"
          description="Track your property enquiries and responses"
          icon="i-lucide-mail"
          to="/dashboard/enquiries"
          class="bg-[url(/img/logo-background.svg)] bg-size-auto-180% bg-no-repeat bg-position-[right_0px_bottom_-50px]"
          :ui="{
            root: 'bg-[#2b3945]! ring-0',
            container: 'shadow-xl',
            title: 'body-sm font-bold text-white',
            leadingIcon: 'h-6 w-6 text-secondary',
            description: 'body-xs text-white',
            body: 'flex flex-col justify-evenly',
          }"
        />
      </div>

      <h2 class="title-xs mb-0! flex items-center gap-2">
        Quick analytics
        <UIcon
          name="i-lucide-bar-chart-3"
          class="text-secondary"
        />
      </h2>
      <OrganismsDashboardAnalyticsCard />

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
      </ClientOnly>

      <!-- Shared Listing Editor Modal -->
      <LazyOrganismsDashboardCreateListingModal ref="listingModal" />
    </template>
  </UDashboardPanel>
</template>
<script lang="ts" setup>
  import type { AccordionItem } from "@nuxt/ui";
  import type { ListingTier } from "~~/layers/database/server/database/prisma/generated/enums";

  definePageMeta({
    middleware: ["authenticated"],
    head: {
      title: "Home",
      icon: "i-lucide-home",
    },
    layout: "dashboard",
  });

  const { user } = useUserSession();
  const { isAgent, isAdmin, createListing, role } = useFeatureFlag();
  const isUser = computed(() => role.value === "USER");

  // Modal ref for creating listings
  const listingModal = ref<{ openForNewListing: (tier: any) => void } | null>(null);
  // Get all recent data from useAnalytics (centralized dashboard data)
  const {
    recentlyViewedListings,
    recentFavourites,
    recentUserNotes,
    recentFavouritesStatus,
    recentNotesStatus,
    isAnalyticsLoading,
  } = useAnalytics();

  const { getRecentListings } = useMyListings();

  const recentListings = await getRecentListings();

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
