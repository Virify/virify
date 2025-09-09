<template>
  <div class="dashboard">
    <div class="analytics-section">
      <slot name="analytics">
        <AtomsStatsCard :value="String(analytics?.totalViews || 0)" :subtitle="`+${analytics?.percentageChange || 0}% from last month`" title="Total Listings Views" :animated="true" />
        <AtomsStatsCard :value="String(analytics?.favoritedByOthersCount || 0)" subtitle="Listings saved by users" title="Listings Favourited" :animated="true" />
        <AtomsStatsCard :value="String(analytics?.totalConversations || 0)" subtitle="Enquiries on your listings" title="Total Enquiries" :animated="true" />
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsAccountListingCard
          :is-collapsed="isViewedCollapsed"
          @toggle="isViewedCollapsed = !isViewedCollapsed"
          title="Recently Viewed Listings"
          icon="search"
          :items="(recentlyViewedListings as RecentItem[])"
          empty-message="No recent views yet."
          :show-favourite-icon="true"
          :show-notes-icon="true"
        />
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsAccountListingCard
          :is-collapsed="isFavouritesCollapsed"
          @toggle="isFavouritesCollapsed = !isFavouritesCollapsed"
          title="Recently Favourited Listings"
          icon="cards/favourite"
          :items="(recentFavourites as RecentItem[])"
          empty-message="No recent favourites yet."
          :show-favourite-icon="true"
        />

        <nuxt-link v-if="recentFavourites?.length > 5 && !isFavouritesCollapsed" to="account/favourites" class="content-section__see-all | button button-sm button-secondary">See all favourites</nuxt-link>
      </slot>
    </div>

    <div class="content-section">
      <slot name="content">
        <OrganismsAccountListingCard
          :is-collapsed="isNotesCollapsed"
          @toggle="isNotesCollapsed = !isNotesCollapsed"
          title="Recently Added Notes"
          icon="cards/notes"
          :items="(recentUserNotes as RecentItem[])"          
          empty-message="No recent notes yet."
          :show-notes-icon="true"
        />

        <nuxt-link v-if="recentUserNotes?.length > 5 && !isNotesCollapsed" to="account/notes" class="content-section__see-all | button button-sm button-secondary">See all notes</nuxt-link>
      </slot>
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

// Open sections by default if they have items
watchEffect(() => {
  if (recentFavourites.value && recentFavourites.value.length > 0) {
    isFavouritesCollapsed.value = false;
  }
  if (recentUserNotes.value && recentUserNotes.value.length > 0) {
    isNotesCollapsed.value = false;
  }
});
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;
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

  @include mq.mobile-only {
    grid-template-columns: 1fr;
  }
}

.content-section {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;

  &__see-all {
    align-self: flex-start;
    width: fit-content;
    margin: 0 var(--size-16) var(--size-16) var(--size-16);
  }
}
</style>
