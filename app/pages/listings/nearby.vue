<template>
  <div class="p-4 space-y-6">
    <!-- Distance Filter -->
    <div class="flex items-center gap-4">
      <label for="distance" class="font-medium">Distance (miles):</label>
      <input id="distance" v-model.number="distance" type="number" min="1" class="border px-3 py-2 rounded w-24" />
    </div>

    <!-- Map -->
    <div class="mt-8" v-if="listings.length">
      <LeafletMap
        :markers="
          listings
            .map((listing) => ({
              id: listing.id,
              lat: listing.property?.address.lat ?? 0,
              lon: listing.property?.address.lon ?? 0,
              title: listing.title,
              bedrooms: listing.property?.bedroomFeatures.length || 0,
              bathrooms: listing.property?.bathroomFeatures.length || 0,
              price: listing.price,
            }))
            .filter((m) => m.lat !== 0 && m.lon !== 0)
        "
        :zoom="11"
      />
    </div>

    <!-- Listings Grid -->
    <div v-if="listings.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="listing in listings" :key="listing.id" class="rounded-xl shadow-lg overflow-hidden flex flex-col">
        <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata" class="w-full h-42 object-cover" />

        <div class="p-4 flex flex-col flex-grow">
          <h2 class="text-md font-semibold mb-2">{{ listing.title }}</h2>
          <p class="text-lg font-bold pt-2">£{{ listing.price.toLocaleString() }}</p>
          <p class="text-xs pt-2">{{ listing.rentalListing?.rentFrequency }}</p>

          <p class="text-sm mt-2">
            <span>{{ listing.property?.address.street }}</span
            >, <span>{{ listing.property?.address.city }}</span
            >,
            <span>{{ listing.property?.address.postcode }}</span>
          </p>

          <div class="mt-2 text-sm">
            <p>
              Bedrooms: <strong>{{ listing.property?.bedroomFeatures.length }}</strong>
            </p>
            <p>
              Bathrooms: <strong>{{ listing.property?.bathroomFeatures.length }}</strong>
            </p>
          </div>

          <div class="mt-2 text-sm">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Rental</span>
          </div>
        </div>

        <div class="p-4">
          <NuxtLink :to="`/listing/${listing.id}`" class="text-blue-600 hover:underline"> View Full Listing </NuxtLink>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 mt-8">No listings found within {{ distance }} miles.</p>
  </div>
</template>

<script setup lang="ts">
import type { ListingWithFullProperty } from "~~/shared/types/listing";

const distance = ref(10);
const addressId = 1;
const listings = ref<ListingWithFullProperty[]>([]);

// Load listings reactively
watchEffect(async () => {
  try {
    const response = await $fetch<{ listings: ListingWithFullProperty[] }>(`/api/search/rent/distance-by-id?distanceMiles=${distance.value}&addressId=${addressId}`);
    listings.value = response.listings;
  } catch (error) {
    console.error("Failed to fetch listings", error);
    listings.value = [];
  }
});
</script>
