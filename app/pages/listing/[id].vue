<template>
  <OrganismsListingDetail v-if="listing" :key="listing.id" :listing="listing" />
</template>

<script setup lang="ts">
const route = useRoute();

/**
 *  Fetch and validate listing - reactive to route changes
 */
const { data: listingData, error } = await useAsyncData(
  `listing-${route.params.id}`,
  async () => {
    const response = await $fetch<{ listing: ListingWithFullProperty }>(`/api/listing/${route.params.id}`);
    if (!response?.listing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Listing not found'
      });
    }
    return response;
  },
  {
    watch: [() => route.params.id]
  }
);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Listing not found',
    fatal: true
  });
}

const listing = computed(() => listingData.value?.listing);

// SEO
const seoTitle = computed(() => {
  const l = listing.value;
  if (!l?.property) return 'Property Listing | Virify';
  
  const beds = l.property.numberBedrooms;
  const type = l.property.type?.name || 'Property';
  const city = l.property.address?.city;
  const mode = l.saleListing ? 'Sale' : 'Rent';
  
  return `${beds} Bed ${type} for ${mode} in ${city} | Virify`;
});

const seoDescription = computed(() => {
  const l = listing.value;
  if (!l?.property) return 'View this property listing on Virify.';
  const desc = l.property.description || `Check out this property in ${l.property.address?.city} on Virify.`;
  return desc.length > 155 ? desc.slice(0, 155) + '...' : desc;
});

const config = useRuntimeConfig();
const seoImage = computed(() => {
  const imageId = getMainImage(listing.value?.property);
  if (!imageId) return null;
  return `https://imagedelivery.net/${config.public.CF_ACCOUNT_HASH}/${imageId}/public`;
});

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: seoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
});

useSchemaOrg([
  {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: seoTitle,
    description: seoDescription,
    image: seoImage,
    url: () => `https://virify.co.uk/listing/${route.params.id}`,
    datePosted: () => listing.value?.createdAt,
    offer: {
      '@type': 'Offer',
      price: () => listing.value?.price,
      priceCurrency: 'GBP',
      availability: () => listing.value?.saleListing?.availabilityStatus === 'AVAILABLE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  }
]);
</script>
