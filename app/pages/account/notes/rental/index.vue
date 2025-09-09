<template>
  <!-- Desktop: Full notes page -->
  <div class="notes-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title -->
    <h2 class="notes-page__title | title-md">Rental Notes</h2>

    <!-- Notes Grid -->
    <div class="notes-page__grid">
      <!-- Rental Notes Section -->
      <div class="notes-card">
        <OrganismsAccountListingCard
          :is-collapsed="isRentCollapsed"
          @toggle="isRentCollapsed = !isRentCollapsed"
          title="Rental Notes"
          icon="cards/notes"
          :items="(rentalNotes as RecentItem[])"
          empty-message="No rental notes yet."
          :show-notes-icon="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
const seoData = {
  title: "Rental Notes - Virify",
  description: "View your notes on rental properties. Browse and manage the notes you've made on rental properties you're interested in.",
  breadcrumbs: [
    { label: "Account", to: "/account" },
    { label: "Notes", to: "/account/notes" },
    { label: "Rental" }
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

const { rentalNotes } = useNotes();

// Component state
const isRentCollapsed = ref(false);

// Generate breadcrumb items from SEO data
const breadcrumbItems = seoData.breadcrumbs;
</script>

<style lang="scss">
// Rental page specific styles
</style>