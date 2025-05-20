<template>
  <OrganismsSearchForm />
  <OrganismsHeroHome v-if="currentView === 'list'" :title="heroTitle" />
  <div :class="['view-toggle-container', 'container', { 'no-bottom-margin': isMapView }]" v-if="searchListings && searchListings.length > 0">
    <MoleculesTabs :options="viewOptions" @update:content="handleViewChange" v-slot="{ content }">
      <div v-show="content === 'list'" class="p-listing-test-grid | container">
        <MoleculesListingCard
          v-for="listing in searchListings"
          :key="listing.id"
          :property-id="listing.id"
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
      <div v-show="content === 'dual'" class="dual-view-container">
        <div class="dual-view-map">
          <Map v-if="currentView === 'dual'" :markers="searchListings" :zoom="mapZoomLevel" :center="mapCenterCoordinates" :interactive="true" :mapId="GLOBAL_MAP_ID" />
        </div>
        <div class="dual-view-listings">
          <MoleculesListingCardHorizontal
            v-for="listing in searchListings"
            :key="listing.id"
            :property-id="listing.id"
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
      <div v-show="content === 'map'" class="map-only-container">
        <Map v-if="currentView === 'map'" :markers="searchListings" :zoom="mapZoomLevel" :center="mapCenterCoordinates" :mapId="GLOBAL_MAP_ID" />
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
  return m ? { lat: m.lat, lon: m.lon } : undefined;
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
  height: calc(100vh - var(--header-height) - 45px);
  /* Adjusted to account for tab height */
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  position: relative;
}

/* Full screen map */
.map-fullscreen {
  height: 100%;
  width: 100%;
}

/* Dual view layout */
.dual-view-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  width: 100vw;
  height: calc(100vh - var(--header-height) - 45px);
  /* Adjusted to account for tab height */
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 0;
  overflow: hidden;
  /* Prevent container from scrolling */

  @media screen and (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
}

.dual-view-listings {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  height: 100%;
  /* Take full height of parent */
  overflow-y: auto;
  /* Only allow scrolling within listing area */
  padding: var(--size-28);
  min-width: 0;
  /* Prevents overflow issues */
}

.dual-view-map {
  position: relative;
  /* Changed from sticky since parent is now fixed height */
  height: 100%;
  /* Take full height of parent */
}

.map-sidebar {
  height: 100%;
  width: 100%;
}

/* Prevent body scrolling when in split or full map view */
:global(body.map-view-active) {
  overflow: hidden;
}

/* Adjust the scroll container to prevent scrolling in map view */
:global(body.map-view-active) #scrollContainer {
  height: 100vh;
  overflow: hidden;
}

/* Responsive adjustments for map view */
@media (max-width: 1100px) {
  .dual-view-container {
    grid-template-columns: 1fr;
    height: auto;
    /* Allow container to expand on mobile */
    overflow: visible;
    /* Allow scrolling on mobile */
  }

  .dual-view-listings {
    height: 50vh;
    /* Fixed height for listings on mobile */
    max-height: 500px;
  }

  .dual-view-map {
    height: 50vh;
    /* Fixed height for map on mobile */
    min-height: 400px;
  }

  /* Re-enable scrolling on mobile */
  :global(body.map-view-active) {
    overflow: auto;
  }

  :global(body.map-view-active) #scrollContainer {
    height: auto;
    overflow: visible;
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
