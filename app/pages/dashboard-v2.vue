<template>
  <div class="dashboard | container">
    <OrganismsNavigation />

    <main class="main">
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
    </main>

    <aside class="sidebar">
      <div class="sidebar-content">
        <slot name="chat">
          Chat
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Dashboard v2",
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
  grid-template-columns: auto 3fr 1fr;
  background: var(--background-100);
  gap: var(--size-16);
  padding: var(--size-16);
  min-height: calc(100vh - var(--header-offset) - var(--size-32));

  @media (max-width: 1024px) {
    grid-template-columns: auto 1fr; // Hide right sidebar on tablet
    
    .sidebar:last-child {
      display: none; // Hide chat sidebar on tablet
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    
    .sidebar:first-child {
      display: none; // Hide desktop sidebar on mobile
    }
    
    .sidebar:last-child {
      display: none; // Hide chat sidebar on mobile
    }
  }
}

.sidebar {
  height: fit-content;
  z-index: 10;
  width: auto;
  transition: width 0.3s ease;

  .sidebar-content {
    background: var(--blue-400);
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: relative;
    padding: var(--size-16);
    color: white;
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0; // Allow flex item to shrink below content size

  @media (max-width: 768px) {
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }
}

.analytics-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  // Ensure grid items don't overflow
  > * {
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
}

.content-section {
  background: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 768px) {
    padding: var(--size-16);
    gap: 1rem;
  }

  // Ensure content doesn't overflow
  > * {
    max-width: 100%;
    box-sizing: border-box;
  }
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  // Ensure grid items don't overflow
  > * {
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
}
</style>
