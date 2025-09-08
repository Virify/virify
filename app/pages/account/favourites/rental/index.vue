<template>
  <!-- Desktop: Full favourties page -->
  <div class="favourites-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title -->
    <h2 class="favourites-page__title | title-md">Rental Favourites</h2>

    <!-- favourites Grid -->
    <div class="favourites-page__grid">
      <!-- Conversations List Section -->
      <div class="favourites-card">
        <OrganismsAccountRecentCard
          :is-collapsed="isRentCollapsed"
          @toggle="isRentCollapsed = !isRentCollapsed"
          title="Rental Favourites"
          icon="cards/favourite"
          :items="(rentalFavourites as RecentItem[])"
          empty-message="No rental favourites yet."
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

const { rentalFavourites } = useFavourites();

// Component state
const isRentCollapsed = ref(false);

// Breadcrumb items
const breadcrumbItems = [
  { label: "Account", to: "/account" },
  { label: "Favourites", to: "/account/favourites" },
  { label: "Rental" }
];
</script>

<style lang="scss">
// Rental page specific styles
</style>
