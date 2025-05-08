<template>
  <div class="| container">
    <h1 class="| title-xl lineheight-sm">Featured Listings</h1>

    <div class="p-listing-test-grid">
      <MoleculesListingCard v-for="listing in listings" :key="listing.id" :property-id="listing.id"
        :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.classification?.name"
        :address="listing.property?.address" :bedrooms="listing.property?.bedroomFeatures.length"
        :bathrooms="listing.property?.bathroomFeatures.length" :description="listing.property?.description" />
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps({
  listings: {
    type: Array as PropType<ListingWithFullProperty[]>,
  },
});
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--size-28);
  padding: var(--size-56);
}
</style>
