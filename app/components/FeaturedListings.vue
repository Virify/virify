<template>
  <div class="| container">
    <h1 class="| title-2xl lineheight-sm">{{ title }}:</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="listing in listings" :key="listing.id" class="rounded-xl shadow-lg overflow-hidden flex flex-col">
        <!-- Property Image -->
        <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata" class="w-full h-42 object-cover" />
        <button class="| button button-xs" @click="$emit('add-to-favourites', listing)">
          <Icon name="healthicons:heart-outline-24px" />
        </button>
        <div class="p-4 flex flex-col flex-grow">
          <!-- Title and Price -->
          <h2 class="text-md font-semibold mb-2">{{ listing.title }}</h2>
          <p class="text-lg font-bold pt-2">£{{ listing.price }}</p>
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
              Bedrooms: <strong>{{ listing.property?.bedroomFeatures.length }}</strong>
            </p>
            <p>
              Bathrooms: <strong>{{ listing.property?.bathroomFeatures.length }}</strong>
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
defineProps({
  listings: {
    type: Array as PropType<ListingWithFullProperty[]>,
  },
  title: {
    type: String,
    default: 'Featured Listings',
  },
});
defineEmits(['add-to-favourites']);
</script>
