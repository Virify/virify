<template>
  <!-- Desktop: Full favourites page -->
  <div class="favourites-page">
    <!-- Title -->
    <div class="favourites-page__header">
      <h2 class="favourites-page__title | title-md">My Favourites</h2>
      <div class="favourites-page__controls">
        <div class="favourites-page__search-filter-row">
          <AtomsInput v-model="searchTerm" type="text" placeholder="Search favourites..." autocomplete="off"
            class="body-sm" />
          <AtomsSelect v-model="categoryFilter" :options="filterOptions"
            class="favourites-page__filter-select | body-sm" />
        </div>
      </div>
    </div>

    <!-- favourites Grid -->
    <div class="favourites-page__grid">
      <!-- Conversations List Section -->
      <div class="favourites-card">
        <OrganismsAccountListingCard 
          :is-collapsed="isSaleCollapsed" 
          @toggle="isSaleCollapsed = !isSaleCollapsed"
          title="Favourites" 
          icon="cards/favourite" 
          :items="(filteredFavourites as RecentItem[])"
          empty-message="No favourites yet." 
          :show-favourite-icon="true"
          :show-notes-icon="true"
          />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
const seoData = {
  title: "My Favourites - Virify",
  description: "View and manage your favourite property listings. Keep track of properties you're interested in buying or renting.",
};

definePageMeta({
  middleware: ["authenticated"],
  layout: "account",
});

useSeoMeta({
  title: seoData.title,
  description: seoData.description,
  ogTitle: seoData.title,
  ogDescription: seoData.description,
  twitterTitle: seoData.title,
  twitterDescription: seoData.description
});

const { filteredFavourites, searchTerm, categoryFilter } = useFavourites();

const filterOptions = [
  { key: 'All', value: 'all' },
  { key: 'Sale', value: 'sale' },
  { key: 'Rental', value: 'rental' },
];

// Component state
const isSaleCollapsed = ref(false);
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.favourites-page {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &__title {
    margin: 0 0 var(--size-16) 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-16);
    overflow: hidden;

    @include mq.not-notebook {
      grid-template-columns: 1fr;
      gap: var(--size-12);
      height: auto;
      overflow: visible;
    }
  }

  &__header {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: var(--size-24);
  }

  &__controls {
    width: 100%;
  }

  &__search-filter-row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--size-12);
    align-items: center;

    @include mq.tablet {
      grid-template-columns: 2fr 1fr;
    }

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      gap: var(--size-8);
    }
  }

  &__filter-select {
    min-width: 160px;
    padding: var(--size-8) var(--size-12);

    @include mq.mobile-only {
      width: 100%;
      min-width: unset;
    }
  }

  .favourites-card {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &--fixed-height {
      max-height: 40dvh;
    }

    &__see-all {
      width: fit-content;
      margin-top: var(--size-8);
      margin-left: var(--size-8);
    }
  }
}

.breadcrumb {
  padding: 0 !important;
}
</style>
