<template>
  <!-- Desktop: Full favourites page -->
  <div class="favourites-page">
    <!-- Title -->
    <MoleculesAccountHeader 
      v-model:search-term="searchTerm" v-model:category-filter="categoryFilter"
      :filter-options="filterOptions"
      :title="'My Favourites'"
      placeholder="Search favourites..."
    />

    <!-- favourites Grid -->
    <div class="favourites-page__grid">
      <!-- Conversations List Section -->
      <AtomsAccountCardContainer>
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
      </AtomsAccountCardContainer>
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
  max-height: calc(100dvh - var(--header-height) - var(--size-32));

  @include mq.mobile-only {
    height: 100%;
    max-height: unset;
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
}
</style>
