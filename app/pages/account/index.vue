<template>
  <div class="dashboard | container">
    <OrganismsNavigation />

    <main class="main">
      <div class="analytics-section">
        <slot name="analytics">
          <AtomsStatsCard :value="String(analytics?.totalViews || 0)" :subtitle="`+${analytics?.percentageChange || 0}% from last month`" title="Total Listings Views" :animated="true" />
          <AtomsStatsCard :value="String(analytics?.favoritedByOthersCount || 0)" subtitle="Listings saved by users" title="Listings Favourited" :animated="true" />
          <AtomsStatsCard :value="String(analytics?.totalConversations || 0)" subtitle="Enquiries on your listings" title="Total Enquiries" :animated="true" />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard
            :is-collapsed="isViewedCollapsed"
            @toggle="isViewedCollapsed = !isViewedCollapsed"
            title="Recently Viewed Listings"
            icon="search"
            :items="recentlyViewedListings"
            variant="blue"
            icon-name="search"
            empty-message="No recent views yet."
          />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard
            :is-collapsed="isFavouritesCollapsed"
            @toggle="isFavouritesCollapsed = !isFavouritesCollapsed"
            title="Recently Favourited Listings"
            icon="cards/favourite"
            :items="recentFavourites"
            variant="secondary"
            icon-name="cards/favourite-filled"
            empty-message="No recent favourites yet."
          />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard
            :is-collapsed="isNotesCollapsed"
            @toggle="isNotesCollapsed = !isNotesCollapsed"
            title="Recently Added Notes"
            icon="cards/notes"
            :items="recentUserNotes"
            variant="blue"
            icon-name="cards/notes"
            :has-background-image="true"
            empty-message="No recent notes yet."
          />
        </slot>
      </div>

      <div class="actions-section">
        <slot name="actions"></slot>
      </div>
    </main>

    <aside class="sidebar">
      <div class="sidebar-content">
        <slot name="chat">
          <OrganismsChatSummary />
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Dashboard",
  },
});

const { analytics, recentFavourites, recentUserNotes, recentlyViewedListings } = useAnalytics();

const isViewedCollapsed = ref(false);
const isFavouritesCollapsed = ref(true);
const isNotesCollapsed = ref(true);
</script>

<style lang="scss" scoped>
.dashboard {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  background: var(--background-100);
  gap: var(--size-16);
  padding: var(--size-16);

  @media (max-width: 1200px) {
    grid-template-columns: 300px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      "nav main"
      "sidebar main";

    .sidebar {
      grid-area: sidebar;
      position: static;
      height: auto;
      max-height: none;
    }

    .main {
      grid-area: main;
    }

    > :first-child {
      grid-area: nav;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "main";
    gap: var(--size-16);
    padding: var(--size-16);

    .sidebar {
      display: none;
    }

    .main {
      grid-area: main;
    }

    > :first-child {
      grid-area: unset;
    }
  }
}

.sidebar {
  position: sticky;
  top: calc(var(--header-offset, 0) + var(--size-16));
  height: fit-content;
  max-height: calc(100vh - var(--header-offset, 0) - var(--size-32));
  z-index: 10;
  width: auto;
  transition: width 0.3s ease;
  align-self: start;

  @media (max-width: 1200px) {
    position: static;
    top: auto;
    height: auto;
    max-height: none;
    align-self: stretch;
  }

  .sidebar-content {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    padding: var(--size-16);
    color: var(--foreground-100);
    overflow-y: auto;

  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 768px) {
    gap: var(--size-16);
  }
}

// Common styles for grid sections
%grid-section {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  > * {
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
}

.analytics-section {
  @extend %grid-section;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-16);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.content-section {
  @extend %grid-section;
  background: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--size-24);
  min-width: 0;

  @media (max-width: 768px) {
    padding: var(--size-16);
    gap: var(--size-16);
  }
}

.actions-section {
  @extend %grid-section;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-24);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--size-16);
  }
}
</style>
