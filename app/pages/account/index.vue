<template>
  <div class="dashboard">
    <div class="analytics-section">
      <slot name="analytics">
        <AtomsStatsCard :value="String(analytics?.totalViews || 0)"
          :subtitle="`+${analytics?.percentageChange || 0}% from last month`" title="Total Listings Views"
          :animated="true" />
        <AtomsStatsCard :value="String(analytics?.favoritedByOthersCount || 0)" subtitle="Listings saved by users"
          title="Listings Favourited" :animated="true" />
        <AtomsStatsCard :value="String(analytics?.totalConversations || 0)" subtitle="Enquiries on your listings"
          title="Total Enquiries" :animated="true" />
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsRecentCard :is-collapsed="isViewedCollapsed" @toggle="isViewedCollapsed = !isViewedCollapsed"
          title="Recently Viewed Listings" icon="search" :items="recentlyViewedListings" variant="blue"
          icon-name="search" empty-message="No recent views yet." />
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsRecentCard :is-collapsed="isFavouritesCollapsed"
          @toggle="isFavouritesCollapsed = !isFavouritesCollapsed" title="Recently Favourited Listings"
          icon="cards/favourite" :items="recentFavourites" variant="secondary" icon-name="cards/favourite-filled"
          empty-message="No recent favourites yet." />
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsRecentCard :is-collapsed="isNotesCollapsed" @toggle="isNotesCollapsed = !isNotesCollapsed"
          title="Recently Added Notes" icon="cards/notes" :items="recentUserNotes" variant="blue"
          icon-name="cards/notes" :has-background-image="true" empty-message="No recent notes yet." />
      </slot>
    </div>

    <div class="actions-section">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Dashboard",
  },
  layout: "account",
});

const { analytics, recentFavourites, recentUserNotes, recentlyViewedListings } = useAnalytics();

const isViewedCollapsed = ref(false);
const isFavouritesCollapsed = ref(true);
const isNotesCollapsed = ref(true);
</script>

<style lang="scss" scoped>
@use '#styles/_utils/media' as mq;
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

}

.analytics-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);

  @include mq.not-notebook {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

.content-section {
  background: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
  min-width: 0;

  @include mq.mobile-only {
    padding: var(--size-16);
    gap: var(--size-16);
  }
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-24);

  @include mq.mobile-only {
    grid-template-columns: 1fr;
    gap: var(--size-16);
  }
}
</style>
