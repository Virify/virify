<template>
  <!-- Desktop: Full favourites page -->
  <div class="favourites-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title  -->
    <h2 class="favourites-page__title | title-md">Sale Favourites</h2>

    <!-- favourites Grid -->
    <div class="favourites-page__grid">
      <!-- Conversations List Section -->
      <div class="favourites-card">
        <OrganismsAccountRecentCard
          :is-collapsed="isSaleCollapsed"
          @toggle="isSaleCollapsed = !isSaleCollapsed"
          title="Sale Favourites"
          icon="cards/favourite"
          :items="(saleFavourites as RecentItem[])"
          empty-message="No sale favourites yet."
          :show-favourite-icon="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Favourites",
  },
  layout: "account",
});

const { saleFavourites } = useFavourites();

// Component state
const isSaleCollapsed = ref(false);

// Breadcrumb items
const breadcrumbItems = [
  { label: "Account", to: "/account" },
  { label: "Favourites", to: "/account/favourites" },
  { label: "Sale" }
];
</script>

<style lang="scss">
// Sale page specific styles
</style>
