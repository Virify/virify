<template>
  <div class="analytics-dashboard">
    <div class="analytics-section">
      <h2 class="analytics-section__title">Your Listing Performance</h2>
      <div class="analytics-grid">
        <AtomsStatsCard :value="String(analytics?.totalViews || 0)" :subtitle="`${(analytics?.percentageChange || 0) > 0 ? '+' : ''}${analytics?.percentageChange || 0}% from last month`" title="Total Listing Views Received" :animated="true" />

        <AtomsStatsCard :value="String(analytics?.favoritedByOthersCount || 0)" subtitle="Times others saved your listings" title="Listings Favourited by Others" :animated="true" />

        <AtomsStatsCard :value="String(analytics?.totalConversations || 0)" subtitle="Enquiries received on your listings" title="Total Enquiries Received" :animated="true" />

        <AtomsStatsCard :value="responseRate" subtitle="Your response rate to enquiries" title="Response Performance" :animated="true" />
      </div>
    </div>

    <div class="analytics-section">
      <h2 class="analytics-section__title">Your Activity</h2>
      <div class="analytics-grid">
        <AtomsStatsCard :value="String(recentlyViewedListings?.length || 0)" subtitle="Properties you have visited" title="Total Listings Visited" :animated="true" />

        <AtomsStatsCard :value="String(favourites?.length || 0)" subtitle="Properties you have saved" title="Total Favourites" :animated="true" />

        <AtomsStatsCard :value="String(userNotes?.length || 0)" subtitle="Notes you have added" title="Total Notes" :animated="true" />

        <AtomsStatsCard :value="String(totalUserActivity)" subtitle="Combined interactions" title="Total Activity" :animated="true" />
      </div>
    </div>

    <div v-if="allUserListings?.length > 0" class="analytics-section">
      <h2 class="analytics-section__title">Your Listings Analytics</h2>
      <div class="analytics-grid">
        <AtomsStatsCard :value="String(allUserListings?.length || 0)" subtitle="All properties you have created" title="Total Listings Created" :animated="true" />

        <AtomsStatsCard :value="String(activeListingsCount)" :subtitle="allUserListings?.length ? `${Math.round((activeListingsCount / allUserListings.length) * 100)}% of your listings` : 'No listings yet'" title="Active Listings" :animated="true" />

        <AtomsStatsCard :value="String(draftListingsCount)" :subtitle="allUserListings?.length ? `${Math.round((draftListingsCount / allUserListings.length) * 100)}% of your listings` : 'No drafts yet'" title="Draft Listings" :animated="true" />

        <AtomsStatsCard :value="averageViewsPerListing" subtitle="Average views received per listing" title="Avg. Views per Listing" :animated="true" />
      </div>
    </div>

    <div class="analytics-section">
      <h2 class="analytics-section__title">Performance Insights</h2>
      <div class="analytics-grid">
        <AtomsStatsCard :value="String(totalOwnedListingFavourites)" subtitle="Combined favourites from all your listings" title="Total Favourites Received" :animated="true" />

        <AtomsStatsCard :value="engagementRate" subtitle="% of views that became enquiries" title="View-to-Enquiry Rate" :animated="true" />

        <AtomsStatsCard :value="topPerformingListing?.property?.address?.city || 'N/A'" subtitle="Your most engaging listing location" title="Top Performing Location" :animated="true" />

        <AtomsStatsCard :value="String(Math.round(((totalOwnedListingFavourites + totalOwnedListingEnquiries) / totalOwnedListingViews) * 100) || 0)" subtitle="% of views that led to action" title="Overall Engagement Score" :animated="true" />
      </div>
    </div>

    <div v-if="allUserListings?.length > 0" class="analytics-section">
      <h2 class="analytics-section__title">Listing Breakdown</h2>
      <div class="analytics-grid">
        <AtomsStatsCard :value="averageFavouritesPerListing" subtitle="Average favourites received per listing" title="Avg. Favourites per Listing" :animated="true" />

        <AtomsStatsCard :value="averageEnquiriesPerListing" subtitle="Average enquiries received per listing" title="Avg. Enquiries per Listing" :animated="true" />

        <AtomsStatsCard
          :value="String(inactiveListingsCount)"
          :subtitle="allUserListings?.length ? `${Math.round((inactiveListingsCount / allUserListings.length) * 100)}% of your listings` : 'No inactive listings'"
          title="Inactive Listings"
          :animated="true"
        />

        <AtomsStatsCard :value="String(totalOwnedListingEnquiries)" subtitle="Combined enquiries from all your listings" title="Total Enquiries Received" :animated="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Analytics",
  },
  layout: "account",
});

const { analytics, recentlyViewedListings, allUserListings } = useAnalytics();
const { favourites } = useFavourites();
const { userNotes } = useNotes();

// Computed properties for derived analytics
const totalUserActivity = computed(() => {
  return (recentlyViewedListings.value?.length || 0) + (favourites.value?.length || 0) + (userNotes.value?.length || 0);
});

const responseRate = computed(() => {
  const conversations = analytics.value?.totalConversations || 0;
  if (conversations === 0) return "N/A";
  // Assume 100% response rate for now - this could be enhanced with actual response data
  return "100%";
});

// User listing counts
const activeListingsCount = computed(() => {
  return allUserListings.value?.filter((listing) => listing.published && !listing.isDraft).length || 0;
});

const draftListingsCount = computed(() => {
  return allUserListings.value?.filter((listing) => listing.isDraft).length || 0;
});

const inactiveListingsCount = computed(() => {
  return allUserListings.value?.filter((listing) => !listing.published && !listing.isDraft).length || 0;
});

// Analytics from all user listings
const totalOwnedListingViews = computed(() => {
  return allUserListings.value?.reduce((sum, listing) => sum + (listing.analytics?.viewsCount || 0), 0) || 0;
});

const totalOwnedListingFavourites = computed(() => {
  return allUserListings.value?.reduce((sum, listing) => sum + (listing.analytics?.favouritesCount || 0), 0) || 0;
});

const totalOwnedListingEnquiries = computed(() => {
  return allUserListings.value?.reduce((sum, listing) => sum + (listing.analytics?.enquiriesCount || 0), 0) || 0;
});

const averageViewsPerListing = computed(() => {
  const listings = allUserListings.value?.length || 0;
  if (listings === 0) return "N/A";
  return Math.round(totalOwnedListingViews.value / listings).toString();
});

const averageFavouritesPerListing = computed(() => {
  const listings = allUserListings.value?.length || 0;
  if (listings === 0) return "N/A";
  return Math.round(totalOwnedListingFavourites.value / listings).toString();
});

const averageEnquiriesPerListing = computed(() => {
  const listings = allUserListings.value?.length || 0;
  if (listings === 0) return "N/A";
  return Math.round(totalOwnedListingEnquiries.value / listings).toString();
});

// Most performing listings
const topPerformingListing = computed(() => {
  if (!allUserListings.value?.length) return null;
  return allUserListings.value.reduce((top, listing) => {
    const currentScore = (listing.analytics?.viewsCount || 0) + (listing.analytics?.favouritesCount || 0) * 2 + (listing.analytics?.enquiriesCount || 0) * 3;
    const topScore = (top.analytics?.viewsCount || 0) + (top.analytics?.favouritesCount || 0) * 2 + (top.analytics?.enquiriesCount || 0) * 3;
    return currentScore > topScore ? listing : top;
  });
});

const engagementRate = computed(() => {
  const views = totalOwnedListingViews.value;
  const enquiries = totalOwnedListingEnquiries.value;
  if (views === 0) return "N/A";
  return `${Math.round((enquiries / views) * 100)}%`;
});
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.analytics-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--size-32);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.analytics-section {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  &__title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--foreground-100);
    margin: 0;
  }
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-16);

  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq.desktop {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
