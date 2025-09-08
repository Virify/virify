<template>
  <!-- Desktop: Full favourites page -->
  <div class="favourites-page">
    <!-- Breadcrumb -->
    <MoleculesBreadcrumb :items="breadcrumbItems" />
    
    <!-- Title -->
    <h2 class="favourites-page__title | title-md">My Favourites</h2>

    <!-- favourites Grid -->
    <div class="favourites-page__grid">
      <!-- Conversations List Section -->
      <div class="favourites-card favourites-card--fixed-height">
        <OrganismsAccountListingCard
          :is-collapsed="isSaleCollapsed"
          @toggle="isSaleCollapsed = !isSaleCollapsed"
          title="For Sale"
          icon="cards/favourite"
          :items="(saleFavourites as RecentItem[])"
          empty-message="No sale favourites yet."
          :show-favourite-icon="true"
        />
      </div>
      <nuxt-link v-if="saleFavourites.length" to="favourites/sale" class="favourites-card__see-all | button button-sm button-tertiary">See sale details...</nuxt-link>

      <!-- Conversation Details Section -->
      <div class="favourites-card favourites-card--fixed-height">
        <OrganismsAccountListingCard
          :is-collapsed="isRentCollapsed"
          @toggle="isRentCollapsed = !isRentCollapsed"
          title="Rental"
          icon="cards/favourite"
          :items="(rentalFavourites as RecentItem[])"
          empty-message="No rental favourites yet."
          :show-favourite-icon="true"
        />
      </div>
      <nuxt-link v-if="rentalFavourites.length" to="favourites/rental" class="favourites-card__see-all | button button-sm button-tertiary">See rental details...</nuxt-link>
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

const { saleFavourites, rentalFavourites } = useFavourites();

// Component state
const isSaleCollapsed = ref(false);
const isRentCollapsed = ref(false);

// Breadcrumb items
const breadcrumbItems = [
  { label: "Account", to: "/account" },
  { label: "Favourites" }
];
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

.favourites-card {
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
