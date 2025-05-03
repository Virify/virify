<template>
  <div>
    <OrganismsHeroHome />

    <SearchListings v-if=searchListings :listings="searchListings" />
    <FeaturedListings v-else :listings="filteredListings" />

    <div class="| stacked container container-2xs">
      <button @click.prevent="openLogin" class="| button button-full">Log in</button>
      <button @click.prevent="openForgotPassword" class="| button button-full">Forgot password</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogLogin, ViewsDialogForgotPassword } from "#components";

const { showDialog } = useDialog();

const searchListings = ref<ListingWithFullProperty[] | null>(null);
provide('searchListings', searchListings);

function openLogin() {
  showDialog({
    component: ViewsDialogLogin,
  });
}

function openForgotPassword() {
  showDialog({
    component: ViewsDialogForgotPassword,
  });
}

const { data: listings, error } = await useAsyncData("listings", () => $fetch<ListingWithFullProperty[]>("/api/listings/all"));

const filteredListings = computed(() => {
  if (!listings.value) return [];
  return listings.value.filter((listing) => listing.listingTier === "FEATURED");
});

console.log("Filtered Listings", filteredListings.value);
</script>

<style>
.p-index-spacer {
  height: 100vh;
}
</style>
