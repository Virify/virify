<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="listing && property">
      <h1 class="pb-4">{{ listing.title }}</h1>
      <!-- media -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <NuxtImg v-for="(mediaItem, index) in property.media" :key="index" :src="(mediaItem.image as string)" :alt="mediaItem?.metadata" class="rounded-lg" width="300" />
      </div>

      <ClientOnly>
        <LeafletMap v-if="property.address" :lat="(property.address.lat as number)" :lon="(property.address.lon as number)" :zoom="15" />
      </ClientOnly>

      <table class="table-auto w-full text-left border-collapse border border-gray-200">
        <tbody>
          <!-- location -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Location</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ property.address.street }}, {{ property.address.city }},
              {{ property.address.postcode }}
            </td>
          </tr>
          <!-- listing -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Listing Description:</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ listing.description }}
            </td>
          </tr>
          <!-- listing tier -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Tier: (not shown to user)</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ listing.listingTier }}
            </td>
          </tr>
          <!-- listing category -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Category: (sale or rent)</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ listing.listingCategory }}
            </td>
          </tr>
          <!-- listing type -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Type: (For Sale, Long term let, auction etc...)</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ listing.listingType }}
            </td>
          </tr>
          <!-- availability -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Availability:</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">
              {{ listing.availabilityStatus }}
            </td>
          </tr>
          <!-- listing price -->
          <tr>
            <th class="px-4 py-2 text-lg font-semibold">Price:</th>
          </tr>
          <tr colsppan="4">
            <td class="px-4 py-2">{{ listing.price }}, {{ listing.priceType }}</td>
          </tr>
        </tbody>
      </table>

      <table class="table-auto w-full text-left border-collapse border border-gray-200">
        <tbody>
          <!-- Basic Info -->
          <tr>
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Basic Info</th>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Title</td>
            <td class="px-4 py-2">{{ property.title }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Description</td>
            <td class="px-4 py-2">{{ property.description }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Type</td>
            <td class="px-4 py-2">{{ property.type.name }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Classification</td>
            <td class="px-4 py-2">{{ property.classification.name }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Furnished</td>
            <td class="px-4 py-2">{{ property.furnishingStatus }}</td>
          </tr>

          <!-- Room Info -->
          <tr>
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Number of Rooms</th>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Bedrooms</td>
            <td class="px-4 py-2">{{ property.bedroomFeatures.length }}</td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-medium">Bathrooms</td>
            <td class="px-4 py-2">{{ property.bathroomFeatures.length }}</td>
          </tr>
          <!-- Bedroom Features -->
          <tr>
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Bedroom Features</th>
          </tr>
          <tr v-for="(room, index) in bedroomFeatures" :key="index">
            <td class="px-4 py-2 font-medium">{{ room.label }}</td>
            <td class="px-4 py-2">
              Size: {{ room.size }}<br />
              Features: {{ room.features }}
            </td>
          </tr>
          <!-- Bathroom Features -->
          <tr>
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">bathroom Features</th>
          </tr>
          <tr v-for="(room, index) in bathroomFeatures" :key="index">
            <td class="px-4 py-2 font-medium">{{ room.label }}</td>
            <td class="px-4 py-2">Features: {{ room.features }}</td>
          </tr>

          <!-- Parking Info -->
          <tr>
            <th colspan="2" class="px-4 py-2 text-lg font-semibold">Parking</th>
          </tr>
          <tr v-for="(item, index) in parking" :key="index">
            <td class="px-4 py-2 font-medium">
              {{ index }}
            </td>
            <td class="px-4 py-2">{{ item }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-500">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import type { ListingWithProperty } from "~~/shared/types/listing";

const route = useRoute();
const listingId = route.params.id as string;

const url: string = `/api/listing/${listingId}`;

const { data } = await useAsyncData("listing", () => $fetch<ListingWithProperty>(url));

const listing = computed(() => data.value);
const property = computed(() => data.value?.property);

// logs for ease
console.log("Listing:", listing.value);
console.log("Property:", property.value);

const parking = computed(() => {
  const parking = property.value?.parking;
  if (!parking) return null;

  return {
    description: parking.description,
    "Has Parking": parking.noParking ? "No" : "Yes",
    Garage: parking.garage ? "Yes" : "No",
    "Ev Charging": parking.evCharging ? "Yes" : "No",
    Driveway: parking.driveway ? "Yes" : "No",
    Carport: parking.carport ? "Yes" : "No",
    "Permit Parking": parking.permitParking ? "Yes" : "No",
    "On Street": parking.onStreet ? "Yes" : "No",
  };
});
const bedroomFeatures = computed(
  () =>
    property.value?.bedroomFeatures.map((feature: { enSuite: any; builtInStorage: any; walkInWardrobe: any; bed: any[] }, i: number) => {
      const attributes: string[] = [];

      if (feature.enSuite) attributes.push("Ensuite");
      if (feature.builtInStorage) attributes.push("Built-in Storage");
      if (feature.walkInWardrobe) attributes.push("Walk-in Wardrobe");

      return {
        label: `Bedroom ${i + 1}`,
        size: feature.bed?.[0] || "Unknown size",
        features: attributes.join(", ") || "None",
      };
    }) || []
);

const bathroomFeatures = computed(
  () =>
    property.value?.bathroomFeatures.map((feature: { bathtub: any; walkInShower: any; upstairs: any; downstairs: any }, i: number) => {
      const attributes: string[] = [];

      if (feature.bathtub) attributes.push("Bath");
      if (feature.walkInShower) attributes.push("Shower");
      if (feature.upstairs) attributes.push("Upstairs");
      if (feature.downstairs) attributes.push("Downstairs");

      return {
        label: `Bathroom ${i + 1}`,
        features: attributes.join(", ") || "None",
      };
    }) || []
);
</script>
