<template>
  <OrganismsSearchForm />
  <OrganismsHeroHome v-if="currentView === 'list'" :title="heroTitle" />
  <div :class="['view-toggle-container', 'container', { 'no-bottom-margin': isMapView }]" v-if="searchListings && searchListings.length > 0">
    <MoleculesTabs :options="viewOptions" @update:content="handleViewChange" v-slot="{ content }">
      <div v-show="content === 'list'" class="p-listing-test-grid | container">
        <MoleculesListingCard
          v-for="listing in searchListings"
          :key="listing.id"
          :listing-id="listing.id"
          :listing-tier="listing.listingTier"
          :price-type="listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency"
          :image="listing.property?.media"
          :price="listing.price"
          :property-type="listing.property?.type?.name"
          :classification="listing.property?.classification?.name"
          :address="listing.property?.address"
          :bedrooms="listing.property?.numberBedrooms"
          :bathrooms="listing.property?.numberBathrooms"
          :description="listing.title"
        />
      </div>
      <div class="dual-view-container" v-show="content === 'dual' || content === 'map'">
        <div class="dual-view-map" :class="{ 'map-fullscreen': content === 'map' }">
          <Map :markers="searchListings" :zoom="mapZoomLevel" :center="mapCenterCoordinates" :interactive="true" />
        </div>
        <div class="dual-view-listings" v-show="content === 'dual'">
          <MoleculesListingCardHorizontal
            v-for="listing in searchListings"
            :key="listing.id"
            :listing-id="listing.id"
            :listing-tier="listing.listingTier"
            :price-type="listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency"
            :image="listing.property?.media"
            :price="listing.price"
            :property-type="listing.property?.type?.name"
            :classification="listing.property?.classification?.name"
            :address="listing.property?.address"
            :bedrooms="listing.property?.numberBedrooms"
            :bathrooms="listing.property?.numberBathrooms"
            :description="listing.title"
          />
        </div>
      </div>
    </MoleculesTabs>
  </div>
</template>

<script setup lang="ts">
import type { ListingCardType } from "~~/shared/types/listing";

// Listings state
const searchListings = ref<ListingCardType[] | null>(null);
provide("searchListings", searchListings);
const searchParams = useState<Record<string, any>>("searchParams");

// View toggles
const currentView = ref("list");
const isMapView = computed(() => currentView.value === "dual" || currentView.value === "map");

const heroTitle = computed(() => {
  if (searchListings.value && searchListings.value.length === 0) {
    return "No Results Found";
  } else {
    return "Property search on another level";
  }
});

const viewOptions = [
  { label: "List View", content: "list" },
  { label: "Split View", content: "dual" },
  { label: "Map View", content: "map" },
];

function handleViewChange(content: string) {
  currentView.value = content;
}

// Map functionality
const { calculateZoomLevelFromRadius } = useMap();

// Map positioning
const mapZoomLevel = computed(() => calculateZoomLevelFromRadius(searchParams.value?.radius));

const mapCenterCoordinates = computed(() => {
  const m = searchParams.value?.coordinates;
  if (
    m &&
    typeof m.lon === "number" &&
    typeof m.lat === "number"
  ) {
    return [m.lon, m.lat] as [number, number];
  }
  return undefined;
});

// Initialize view from URL
onMounted(() => {
  const route = useRoute();
  if (route.query.view === "map") {
    currentView.value = route.query.fullMap === "true" ? "map" : "dual";
  }
});
</script>

<style>
.view-toggle-container {
  margin-bottom: var(--size-28);
}

/* Add this for Vue class binding */
.view-toggle-container.no-bottom-margin,
.view-toggle-container[data-map-view="true"] {
  margin-bottom: 0;
}

/* Map-only view container */
.map-only-container {
  width: 100vw;
  height: calc(100vh - var(--header-expanded-height));
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  position: relative;
}

/* Full screen map */
.map-fullscreen {
  height: 100%;
  width: 100%;
  position: relative;
}

/* Dual view layout */
.dual-view-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  width: 100vw;
  height: calc(100vh - var(--header-expanded-height));
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 0;
  overflow: hidden;
}

.dual-view-map {
  position: relative;
  height: 100%;
  transition: width 0.3s, height 0.3s;
}

.dual-view-map.map-fullscreen {
  grid-column: 1 / -1;
  width: 100vw;
  height: 100vh;
  min-height: 0;
  z-index: 2;
}

.dual-view-listings {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  height: 100%;
  overflow-y: auto;
  padding: var(--size-28);
  min-width: 0;
}

@media (max-width: 1100px) {
  .dual-view-container {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }
  .dual-view-listings {
    height: 50vh;
    max-height: 500px;
  }
  .dual-view-map {
    height: 50vh;
    min-height: 400px;
  }
  .dual-view-map.map-fullscreen {
    height: 100vh;
    min-height: 0;
  }
}

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
