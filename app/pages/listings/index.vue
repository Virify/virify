<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    <div
      v-for="listing in listings"
      :key="listing.id"
      class="rounded-xl shadow-lg overflow-hidden flex flex-col"
    >
      <!-- Property Image -->
      <NuxtImg
        :src="listing.property?.media[0]?.image as string"
        :alt="listing.property?.media[0]?.metadata"
        class="w-full h-42 object-cover"
      />

      <div class="p-4 flex flex-col flex-grow">
        <!-- Title and Price -->
        <h2 class="text-md font-semibold mb-2">{{ listing.title }}</h2>
        <p class="text-lg font-bold pt-2">£{{ listing.price.toLocaleString() }}</p>

        <!-- Address -->
        <p class="text-sm mt-2">
          <span>{{ listing.property?.address.street }}</span>,
          <span>{{ listing.property?.address.city }}</span>,
          <span>{{ listing.property?.address.postcode }}</span>
        </p>

        <!-- Bedrooms and Bathrooms -->
        <div class="mt-2 text-sm">
          <p>Bedrooms: <strong>{{ listing.property?.bedroomFeatures.length }}</strong></p>
          <p>Bathrooms: <strong>{{ listing.property?.bathroomFeatures.length }}</strong></p>
        </div>
      </div>

      <!-- Link to Full Listing -->
      <div class="p-4">
        <NuxtLink
          :to="`/listing/${listing.id}`"
          class="py-2"
        >
          View Full Listing
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListingWithFullProperty } from "~~/shared/types/listing";

// Fetch data using useAsyncData
const { data: listings, error } = await useAsyncData('listings', () => $fetch<ListingWithFullProperty[]>('/api/listings/all'));

if (error.value) {
  console.error('Error fetching listings:', error.value);
}
</script>
