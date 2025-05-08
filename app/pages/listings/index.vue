<template>
  <div class="p-4 space-y-6">
    <!-- Tabs -->
    <div class="flex gap-4 border-b pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="['px-4 py-2 rounded-t-md border-b-2 transition', activeTab === tab ? 'font-semibold' : 'border-transparent text-gray-500']">
        {{ tab }}
      </button>
    </div>

    <div class="mt-8">
      <OrganismsMapsLeafletMap
        :markers="
          filteredListings
            .map((listing) => ({
              id: listing.id,
              lat: listing.property?.address.lat ?? 0,
              lon: listing.property?.address.lon ?? 0,
              title: listing.title,
              bedrooms: listing.property?.numberBedrooms || 0,
              bathrooms: listing.property?.numberBathrooms || 0,
              price: listing.price,
            }))
            .filter((m) => m.lat !== 0 && m.lon !== 0)
        "
        :zoom="11"
      />
    </div>

    <!-- Listings Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="listing in filteredListings" :key="listing.id" class="rounded-xl shadow-lg overflow-hidden flex flex-col">
        <!-- Property Image -->
        <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata" class="w-full h-42 object-cover" />

        <div class="p-4 flex flex-col flex-grow">
          <!-- Title and Price -->
          <h2 class="text-md font-semibold mb-2">{{ listing.title }}</h2>
          <p class="text-lg font-bold pt-2">£{{ listing.price.toLocaleString() }}</p>
          <p v-if="listing.rentalListing" class="text-xs pt-2">{{ listing.rentalListing?.rentFrequency }}</p>
          <p v-else class="text-xs pt-2">{{ listing.saleListing?.priceType }}</p>

          <!-- Address -->
          <p class="text-sm mt-2">
            <span>{{ listing.property?.address.street }}</span
            >, <span>{{ listing.property?.address.city }}</span
            >,
            <span>{{ listing.property?.address.postcode }}</span>
          </p>

          <!-- Bedrooms and Bathrooms -->
          <div class="mt-2 text-sm">
            <p>
              Bedrooms: <strong>{{ listing.property?.numberBedrooms }}</strong>
            </p>
            <p>
              Bathrooms: <strong>{{ listing.property?.numberBathrooms }}</strong>
            </p>
          </div>

          <div v-if="listing.rentalListing" class="mt-2 text-sm">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Rental</span>
          </div>
          <div v-if="listing.saleListing" class="mt-2 text-sm">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">For Sale</span>
          </div>
        </div>

        <!-- Link to Full Listing -->
        <div class="p-4">
          <NuxtLink :to="`/listing/${listing.id}`" class="text-blue-600 hover:underline"> View Full Listing </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListingCardType  } from "~~/shared/types/listing";

const tabs = ["All", "Rental", "Sale"];
const activeTab = ref("All");

const { data: listings, error } = await useAsyncData("listings", () => $fetch<ListingCardType[]>("/api/listings/all"));

if (error.value) {
  console.error("Error fetching listings:", error.value);
}

const filteredListings = computed(() => {
  if (!listings.value) return [];

  switch (activeTab.value) {
    case "Rental":
      return listings.value.filter((listing) => !!listing.rentalListing);
    case "Sale":
      return listings.value.filter((listing) => !!listing.saleListing);
    default:
      return listings.value;
  }
});
</script>
