<template>
  <div class="dashboard | container">
    <aside class="sidebar">
      <div class="sidebar-content">
        <slot name="navigation">
          <p>Naivagation</p>
        </slot>
      </div>
    </aside>

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
  grid-template-columns: 1fr 3fr 1fr;
  background: var(--background-100);
  gap: var(--size-16);
  padding: var(--size-16);
  min-height: calc(100vh - var(--header-offset) - var(--size-32));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}

.sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--size-16));
  height: fit-content;
  max-height: calc(100vh - var(--header-height) - var(--size-32) - var(--size-16));
  overflow-y: auto;
  z-index: 10;
}

.sidebar-content {
  background: var(--blue-400);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  @media (max-width: 768px) {
    gap: 1rem;
  }
}

.analytics-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

  @media (max-width: 768px) {
    gap: 1rem;
  }
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
