<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="| title-2xl lineheight-sm">{{ title }}: {{ resultsLength }} </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="listing in listings" :key="listing.id"
        class="rounded-xl shadow-lg overflow-hidden flex flex-col relative">
        <!-- Property Image -->
        <NuxtImg :src="listing.property?.media[0]?.image as string" :alt="listing.property?.media[0]?.metadata"
          class="w-full h-42 object-cover" />
        <MoleculesListingFav :listing-id="listing.id" @toggle="handleToggle" :user-favourites="userFavourites" class="m-listing-fav" />
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
          <p v-if="listing.property?.additionalFeatures" class="body-sm">Pets: {{ listing.property?.additionalFeatures?.petFriendly }}</p>
          <p v-if="listing.property?.parking" class="body-sm">EV Charging: {{ listing.property?.parking?.evCharging }}</p>
          <p v-if="listing.property?.parking" class="body-sm">Garage: {{ listing.property?.parking?.garage }}</p>
          <p v-if="listing.property?.additionalFeatures" class="body-sm">Garden: {{ listing.property?.outdoorSpace?.frontGarden || listing.property?.outdoorSpace?.rearGarden }}</p>
           <p v-if="listing.property?.accessibilityFeatures" class="body-sm">Accessible: {{ listing.property?.accessibilityFeatures.wheelchairFriendly }}</p>

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
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded body-sm">{{ convertEnumToString(listing.saleListing.availabilityStatus) }}</span>
          </div>
          <div v-if="listing.rentalListing" class="mt-2 text-sm">
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded body-sm">{{ convertEnumToString(listing.rentalListing.availabilityStatus) }}</span>
          </div>
          <div v-if="listing.saleListing" class="mt-2 text-sm">
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded body-sm">For Sale</span>
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
import { convertEnumToString } from '~~/shared/utils/enums';
const props = defineProps({
  listings: {
    type: Array as PropType<ListingCardType[]>,
  },
  title: {
    type: String,
    default: "Featured Listings",
  },
});

const resultsLength = computed(() => {
  return props.listings?.length;
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
