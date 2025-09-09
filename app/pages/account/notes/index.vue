<template>
  <!-- Desktop: Full notes page -->
  <div class="notes-page">

    <div class="notes-page__header">
      <h2 class="notes-page__title | title-md">My Notes</h2>
      <div class="notes-page__controls">
        <div class="notes-page__search-filter-row">
          <AtomsInput
            v-model="searchTerm"
            type="text"
            placeholder="Search notes..."
            autocomplete="off"
            class="body-sm"
          />
          <AtomsSelect
            v-model="categoryFilter"
            :options="filterOptions"
            class="notes-page__filter-select | body-sm"
          />
        </div>
      </div>
    </div>

    <!-- Notes Grid -->
    <div class="notes-page__grid">
      <!-- Sale Notes Section -->
      <div class="notes-card">
        <OrganismsAccountListingCard
          :is-collapsed="isNotesCollapsed"
          @toggle="isNotesCollapsed = !isNotesCollapsed"
          title="My Notes"
          icon="cards/notes"
          :items="(filteredUserNotes as RecentItem[])"
          empty-message="No notes yet."
          :show-notes-icon="true"
          :show-favourite-icon="true"
        />
      </div>
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
  twitterDescription: seoData.description
});

const { filteredUserNotes, searchTerm, categoryFilter } = useNotes();

const filterOptions = [
  { key: 'All', value: 'all' },
  { key: 'Sale', value: 'sale' },
  { key: 'Rental', value: 'rental' },
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

  &__header {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: var(--size-24);
  }

  &__title { margin: 0 0 var(--size-16) 0; }

  &__controls { width: 100%; }

  &__search-filter-row {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: var(--size-12);
    align-items: center;

    @include mq.tablet { grid-template-columns: 2fr 1fr; }
    @include mq.mobile-only { grid-template-columns: 1fr; gap: var(--size-8); }
  }

  &__filter-select {
    min-width: 160px;
    padding: var(--size-8) var(--size-12);

    @include mq.mobile-only { width: 100%; min-width: unset; }
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

.notes-card {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--fixed-height {
    max-height: 50dvh;
  }

  &__see-all {
    width: fit-content;
    margin-top: var(--size-8);
    margin-left: var(--size-8);
  }
}

.breadcrumb {
  padding: 0 !important;
}
</style>