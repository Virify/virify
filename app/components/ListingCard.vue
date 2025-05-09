<template>
  <!-- Property Image -->
  <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata"
    class="w-full h-42 object-cover" />
  <MoleculesListingFav :listing-id="listing.id" class="m-listing-fav" />
  <p v-if="listing.distanceMiles">Distance: {{ roundFloat(listing.distanceMiles, 1) }} miles</p>
  <div class="p-4 flex flex-col flex-grow">
    <!-- Title and Price -->
    <p class="body-md">Listing Tier: {{ listing.listingTier }}</p>
    <h2 class="text-sm font-semibold mb-2">{{ listing.title }}</h2>
    <p class="text-lg font-bold pt-2">Price: {{ numberToCurrency(listing.price) }}</p>
    <p v-if="listing.rentalListing" class="body-sm pt-2">Rent Frequency: {{ listing.rentalListing?.rentFrequency }}</p>
    <p v-else class="body-sm pt-2 capitalize">Price type:{{ convertEnumToString(listing.saleListing?.priceType!) }}</p>
    <p v-if="listing.publishedAt" class="body-sm">Added to site: {{ dateAddedToDays(listing.publishedAt) }} Days ago</p>
    <p v-if="listing.property?.type" class="capitalize">Property Type: {{ listing.property?.type?.name }}</p>
    <p v-if="listing.property?.additionalFeatures" class="body-sm">Pets: {{
      listing.property?.additionalFeatures?.petFriendly }}</p>
    <p v-if="listing.property?.parking" class="body-sm">EV Charging: {{ listing.property?.parking?.evCharging }}</p>
    <p v-if="listing.property?.parking" class="body-sm">Garage: {{ listing.property?.parking?.garage }}</p>
    <p v-if="listing.property?.additionalFeatures" class="body-sm">Garden: {{
      listing.property?.outdoorSpace?.frontGarden || listing.property?.outdoorSpace?.rearGarden }}</p>
    <p v-if="listing.property?.accessibilityFeatures" class="body-sm">Accessible: {{
      listing.property?.accessibilityFeatures.wheelchairFriendly }}</p>

    <!-- Address -->
    <p class="text-sm mt-2">
      <span>{{ listing.property?.address.street }}</span>, <span>{{ listing.property?.address.city }}</span>,
      <span>{{ listing.property?.address.postcode }}</span>
    </p>

    <!-- Bedrooms and Bathrooms -->
    <div class="mt-2 text-sm">
      <p>
        Bedrooms: <strong>{{ listing.property?.numberBedrooms }}</strong>
      </p>
      <p>π
        Bathrooms: <strong>{{ listing.property?.numberBathrooms }}</strong>
      </p>
    </div>

    <div v-if="listing.rentalListing" class="mt-2 text-sm">
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded body-sm">Rental</span>
    </div>
    <div v-if="listing.saleListing" class="mt-2 text-sm">
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded body-sm">{{
        convertEnumToString(listing.saleListing.availabilityStatus) }}</span>
    </div>
    <div v-if="listing.rentalListing" class="mt-2 text-sm">
      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded body-sm">{{
        convertEnumToString(listing.rentalListing.availabilityStatus) }}</span>
    </div>
    <div v-if="listing.saleListing" class="mt-2 text-sm">
      <span class="bg-green-100 text-green-800 px-2 py-1 rounded body-sm">For Sale</span>
    </div>
  </div>
  <!-- Link to Full Listing -->
  <div class="p-4">
    <NuxtLink :to="`/listing/${listing.id}`" class="text-blue-600 hover:underline"> View Full Listing </NuxtLink>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  listing: {
    type: Object as PropType<ListingCardType>,
    required: true,
  },
  userFavourites: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
</script>