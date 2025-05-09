<template>
  <div>
    <OrganismsHeroHome />

    <div class="p-listing-test-grid | container">
      <MoleculesListingCard v-for="listing in listings" :key="listing.id" :property-id="listing.id"
        :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
        :address="listing.property?.address" :bedrooms="listing.property?.numberBedrooms"
        :bathrooms="listing.property?.numberBathrooms" :description="listing.title" />
    </div>

    <!--
      We can add this as a button so if the watcher doesn't fire for any
      reason (say, if we scroll too fast, given we are debouncing) then
      the user can still call this manually

      @TODO style this
    -->
    <button type="button" ref="$trigger" @click.prevent="fetchNextPage">
      Load more
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core';

/**
 * State
 */
const page = ref(1)

/**
 * Fetch initial listings
 */
const listings = ref<ListingCardType[]>([])

const { data: listingsFetch } = await useAsyncData('featured-listings', () =>
  $fetch<ListingCardType[]>('/api/listings/featured', {
    params: {
      page: page.value,
      pageSize: 8
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
const fetchNextPage = useDebounceFn(() => {
  page.value += 1
}, 1000)

/**
 * Trigger for infinite scroll
 */
const $trigger = useTemplateRef('$trigger')

useIntersectionObserver($trigger, ([entries]) => {
  if (!entries?.isIntersecting) return

  fetchNextPage()
});
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