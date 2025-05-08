<template>
  <div class="| container">
    <h1 class="| title-2xl lineheight-sm">{{ title }}</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="listing in listings" :key="listing.id"
        class="rounded-xl shadow-lg overflow-hidden flex flex-col relative">
        <!-- Property Image -->
        <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata"
          class="w-full h-42 object-cover" />
        <MoleculesListingFav :listing-id="listing.id" @toggle="handleToggle" :user-favourites="userFavourites" class="m-listing-fav" />
        <div class="p-4 flex flex-col flex-grow">
          <!-- Title and Price -->
          <h2 class="text-sm font-semibold mb-2">{{ listing.title }}</h2>
          <p class="text-lg font-bold pt-2">{{ numberToCurrency(listing.price) }}</p>
          <p v-if="listing.rentalListing" class="text-xs pt-2">{{ listing.rentalListing?.rentFrequency }}</p>
          <p v-else class="text-xs pt-2 capitalize">{{ mapPriceType(listing.saleListing?.priceType!) }}</p>
          <p v-if="listing.publishedAt">Added to site: {{ dateAddedToDays(listing.publishedAt) }}</p>
          <p v-if="listing.property?.type" class="capitalize">Type: {{ listing.property?.type?.name }}</p>
          <p v-if="listing.property?.additionalFeatures" class="text-xs">Pets: {{ listing.property?.additionalFeatures?.petFriendly }}</p>
          <p v-if="listing.property?.additionalFeatures" class="text-xs">EV Charging: {{ listing.property?.parking?.evCharging }}</p>
          <p v-if="listing.property?.additionalFeatures" class="text-xs">Garden: {{ listing.property?.outdoorSpace?.frontGarden || listing.property?.outdoorSpace?.rearGarden }}</p>

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
import { numberToCurrency } from '~~/shared/utils/currency';
const props = defineProps({
  listings: {
    type: Array as PropType<ListingCardType[]>,
  },
  title: {
    type: String,
    default: "Featured Listings",
  },
});
/**
 * state
 */
const userFavourites = ref<number[]>([]);
const emit = defineEmits(["remove-from-listings"]);

/**
 * composables
 */
const { addToFavourites, removeFromFavourites, getUserFavouriteIds } = useFavourites();
const { loggedIn } = useUserSession();

/**
 * lifecycle
 */
onMounted(async () => {
  if(loggedIn.value) {
    userFavourites.value = await getUserFavouriteIds();
  }
});

/**
 * emits
 */
const handleToggle = async (listingId: number, action: "add" | "remove") => {
  if (action === "add") {
    userFavourites.value = await addToFavourites(listingId);
  }
  if (action === "remove") {
    emit("remove-from-listings", listingId);
    userFavourites.value = await removeFromFavourites(listingId);
  }
};

/**
 * watch
 */
watch(loggedIn, async (isLoggedIn) => {
    if (isLoggedIn) {
      // fetch user favourites when logged in;
      userFavourites.value = await getUserFavouriteIds();
    }
    if(!isLoggedIn) {
      // reset user favourites when logged out
      userFavourites.value = [];
    }
  });
</script>
<style lang="scss">
@use "#styles/_utils/functions" as fn;

.m-listing-fav {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
