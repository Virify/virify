<template>
  <!-- Desktop: Full notes page -->
  <div class="notes-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title  -->
    <h2 class="notes-page__title | title-md">Sale Notes</h2>

    <!-- Notes Grid -->
    <div class="notes-page__grid">
      <!-- Sale Notes Section -->
      <div class="notes-card">
        <OrganismsAccountListingCard
          :is-collapsed="isSaleCollapsed"
          @toggle="isSaleCollapsed = !isSaleCollapsed"
          title="Sale Notes"
          icon="cards/notes"
          :items="(saleNotes as RecentItem[])"
          empty-message="No sale notes yet."
          :show-notes-icon="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO metadata
const seoData = {
  title: "Sale Notes - Virify",
  description: "View your notes on properties for sale. Browse and manage the notes you've made on properties you're interested in purchasing.",
  breadcrumbs: [
    { label: "Account", to: "/account" },
    { label: "Notes", to: "/account/notes" },
    { label: "Sale" }
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

const { saleNotes } = useNotes();

// Component state
const isSaleCollapsed = ref(false);

// Generate breadcrumb items from SEO data
const breadcrumbItems = seoData.breadcrumbs;
</script>

<style lang="scss">
// Sale page specific styles
</style>