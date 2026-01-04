<template>
  <!-- Desktop: Full notes page -->
  <div class="notes-page">
    <MoleculesAccountHeader v-model:search-term="searchTerm" v-model:category-filter="categoryFilter" :filter-options="filterOptions" :title="'My Notes'" placeholder="Search notes..." />

    <!-- Notes Grid -->
    <div class="notes-page__grid">
      <!-- Sale Notes Section -->
      <AtomsAccountCardContainer>
        <OrganismsAccountListingCard :is-collapsed="isNotesCollapsed" @toggle="isNotesCollapsed = !isNotesCollapsed"
          title="My Notes" icon="cards/notes" :items="(filteredUserNotes as RecentItem[])" empty-message="Empty"
          :show-notes-icon="true" :show-favourite-icon="true" />
      </AtomsAccountCardContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
const seoData = {
  title: "My Notes - Virify",
  description: "View and manage your property notes. Keep track of important information about properties you're researching.",
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
  twitterDescription: seoData.description,
});

const { filteredUserNotes, searchTerm, categoryFilter } = useNotes();

const filterOptions = [
  { key: "All", value: "all" },
  { key: "Sale", value: "sale" },
  { key: "Rental", value: "rental" },
];

// Component state
const isNotesCollapsed = ref(false);
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.notes-page {
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
