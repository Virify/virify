<template>
  <div class="container">
    <OrganismsSearchForm />

    <div style="height: 200vh; background-color: #ccc; border-radius: 2em"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * State
 */
const searchListings = ref<ListingCardType[] | null>(null);
provide("searchListings", searchListings);
const searchParams = useState<Record<string, any>>("searchParams");

watch(searchParams, () => {
  if (searchParams.value) {
    console.log("searchParams", searchParams.value);
  }
})

const typeOfListing = computed(() => {
  return searchListings.value ?? initialListings.value;
});

/**
 * Fetch initial listings
 */
const { data: initialListings } = await useAsyncData('featured-listings', () =>
  $fetch<ListingCardType[]>('/api/listings/featured')
);

</script>
