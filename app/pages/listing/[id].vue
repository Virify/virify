<template>
  <OrganismsListingDetail v-if="listing" :key="listing.id" :listing="listing" />
</template>

<script setup lang="ts">
const route = useRoute();

/**
 *  Fetch and validate listing - reactive to route changes
 */
const { data: listingData } = await useAsyncData(
  () => `listing-${route.params.id}`,
  async () => {
    try {
      const response = await $fetch<{ listing: any }>(`/api/listing/${route.params.id}`);
      if (!response?.listing) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Listing not found'
        });
      }
      return response;
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 404,
        statusMessage: 'Listing not found'
      });
    }
  },
  {
    watch: [() => route.params.id]
  }
);

const listing = computed(() => listingData.value?.listing);
</script>
