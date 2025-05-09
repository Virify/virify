<template>
  <div>
    <OrganismsHeroHome />

    <OrganismsPagination :is-pending="pending" @reached-end="nextPage" class="| container">
      <div class="p-listing-test-grid">
        <MoleculesListingCard v-for="listing in listings" :key="listing.id" :property-id="listing.id"
          :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
          :address="listing.property?.address" :bedrooms="listing.property?.numberBedrooms"
          :bathrooms="listing.property?.numberBathrooms" :description="listing.title" />
      </div>
    </OrganismsPagination>
  </div>
</template>

<script setup lang="ts">
/**
 * State
 */
const page = ref(1)

/**
 * Fetch initial listings
 */
const listings = ref<ListingCardType[]>([])

const { data: listingsFetch, pending } = await useAsyncData('featured-listings', () =>
  $fetch<ListingCardType[]>('/api/listings/featured', {
    params: {
      page: page.value,
      pageSize: 16
    }
  }), {
  dedupe: 'defer',
  watch: [page]
})

watch(listingsFetch, (newValue) => {
  if (!Array.isArray(newValue)) return

  listings.value.push(...newValue)
}, { immediate: true })

/**
 *  Page fetcher
 */
function nextPage() {
  page.value += 1
}
</script>

<style>
.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--size-28);
  padding: var(--size-56);
  min-height: 100vh;
}
</style>