<template>
  <div class="p-4 space-y-6">
    <!-- Tabs -->
    <div class="flex gap-4 border-b pb-2">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
        :class="['px-4 py-2 rounded-t-md border-b-2 transition', activeTab === tab ? 'font-semibold' : 'border-transparent text-gray-500']">
        {{ tab }}
      </button>
    </div>

    <div class="mt-8">
      <OrganismsMap :markers="filteredListings
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
        " :zoom="11" :interactive="true" />
    </div>
    <div class="p-listing-test-grid | container">
      <MoleculesListingCard v-for="listing in listings" :key="listing.id" :property-id="listing.id"
        :listing-tier="listing.listingTier"
        :price-type="listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency"
        :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
        :classification="listing.property?.classification?.name" :address="listing.property?.address"
        :bedrooms="listing.property?.numberBedrooms" :bathrooms="listing.property?.numberBathrooms"
        :description="listing.title" />
    </div>

  </div>
</template>

<script setup lang="ts">
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
<style>
.p-listing-test-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--size-28);
  padding: var(--size-56);
}

@media (max-width: 1100px) {
  .p-listing-test-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .p-listing-test-grid {
    grid-template-columns: 1fr;
  }
}
</style>