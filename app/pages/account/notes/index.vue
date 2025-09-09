<template>
  <!-- Desktop: Full notes page -->
  <div class="notes-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title -->
    <h2 class="notes-page__title | title-md">My Notes</h2>

    <!-- Notes Grid -->
    <div class="notes-page__grid">
      <!-- Sale Notes Section -->
      <div class="notes-card notes-card--fixed-height">
        <OrganismsAccountListingCard
          :is-collapsed="isSaleCollapsed"
          @toggle="isSaleCollapsed = !isSaleCollapsed"
          title="For Sale"
          icon="cards/notes"
          :items="(saleNotes as RecentItem[])"
          empty-message="No sale notes yet."
          :show-notes-icon="true"
        />
      </div>
      <nuxt-link v-if="saleNotes.length" to="notes/sale" class="notes-card__see-all | button button-sm button-secondary">See sale details...</nuxt-link>

      <!-- Rental Notes Section -->
      <div class="notes-card notes-card--fixed-height">
        <OrganismsAccountListingCard
          :is-collapsed="isRentCollapsed"
          @toggle="isRentCollapsed = !isRentCollapsed"
          title="Rental"
          icon="cards/notes"
          :items="(rentalNotes as RecentItem[])"
          empty-message="No rental notes yet."
          :show-notes-icon="true"
        />
      </div>
      <nuxt-link v-if="rentalNotes.length" to="notes/rental" class="notes-card__see-all | button button-sm button-secondary">See rental details...</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
const seoData = {
  title: "My Notes - Virify",
  description: "View and manage your property notes. Keep track of important information about properties you're researching.",
  breadcrumbs: [
    { label: "Account", to: "/account" },
    { label: "Notes" }
  ]
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

const { saleNotes, rentalNotes } = useNotes();

// Component state
const isSaleCollapsed = ref(false);
const isRentCollapsed = ref(false);

// Generate breadcrumb items from SEO data
const breadcrumbItems = seoData.breadcrumbs;
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

  &__title {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: var(--size-16);
    margin: 0;
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