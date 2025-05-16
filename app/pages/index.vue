<template>
  <OrganismsSearchForm />
  <OrganismsHeroHome v-if="currentView === 'list'" />
  <div :class="['view-toggle-container', 'container', { 'no-bottom-margin': isMapView }]" v-if="searchListings">
    <MoleculesTabs :options="viewOptions" @update:content="handleViewChange" v-slot="{ content }">
      <div v-show="content === 'list'" class="p-listing-test-grid | container">
        <MoleculesListingCard v-for="listing in searchListings" :key="listing.id" :property-id="listing.id"
          :listing-tier="listing.listingTier"
          :price-type="listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency"
          :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
          :classification="listing.property?.classification?.name" :address="listing.property?.address"
          :bedrooms="listing.property?.numberBedrooms" :bathrooms="listing.property?.numberBathrooms"
          :description="listing.title" />
      </div>
      <div v-show="content === 'dual'" class="dual-view-container">
        <div class="dual-view-map">
          <OrganismsMap ref="dualMapRef" :markers="getMapMarkers" :zoom="mapZoomLevel" :interactive="true"
            customClass="map-sidebar" @property-note="handleMapNote" @property-favourite="handleMapFavourite" />
        </div>
        <div class="dual-view-listings">
          <MoleculesListingCardHorizontal v-for="listing in searchListings" :key="listing.id" :property-id="listing.id"
            :listing-tier="listing.listingTier"
            :price-type="listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency"
            :image="listing.property?.media" :price="listing.price" :property-type="listing.property?.type?.name"
            :classification="listing.property?.classification?.name" :address="listing.property?.address"
            :bedrooms="listing.property?.numberBedrooms" :bathrooms="listing.property?.numberBathrooms"
            :description="listing.title" />
        </div>
      </div>
    </MoleculesTabs>
  </div>
</template>

<script setup lang="ts">
/**
 * State
 */
const searchListings = ref<ListingCardType[] | null>(null);
provide("searchListings", searchListings);
const searchParams = useState<Record<string, any>>("searchParams");

// Replace 'any' with the actual type of your OrganismsMap component instance if available
type OrganismsMapInstance = {
  map: any; // Replace 'any' with the actual map instance type if known
};

const dualMapRef = ref<OrganismsMapInstance | null>(null);

// Track current view (initialized with default view)
const currentView = ref('list');
const isMapView = computed(() => currentView.value === 'dual');

// View toggle options
const viewOptions = ref([
  { label: "List View", content: "list" },
  { label: "Map View", content: "dual" }
]);

// Update currentView when tab changes
function handleViewChange(content: string) {
  currentView.value = content;
}

// Import composables for notes and favorites
const { isFavourite } = useFavourites();
const { hasNote } = useNotes();

// Add event listeners for map marker buttons
onMounted(() => {
  // Check URL for any view parameter and set the initial view
  const route = useRoute();
  if (route.query.view === 'map') {
    currentView.value = 'dual';
  }
});

// Add new methods to handle map events
function handleMapNote(propertyId: number) {
  // Use the useNotes composable directly, which now checks for login and shows dialogs
  const { showNoteDialog } = useNotes();
  showNoteDialog(propertyId);
}

function handleMapFavourite(propertyId: number) {
  // Use the useFavourites composable directly, which now checks for login and toggles
  const { toggleFavourite } = useFavourites();
  toggleFavourite(propertyId);
}

// Function to create map markers from listings data
// Reactive computed property so markers update when notes or favorites change
const getMapMarkers = computed(() => {
  // Always return a new array reference for reactivity
  return [...searchListings.value
    ?.map((listing) => ({
      id: listing.id,
      lat: listing.property?.address.lat ?? 0,
      lon: listing.property?.address.lon ?? 0,
      title: listing.title,
      bedrooms: listing.property?.numberBedrooms || 0,
      bathrooms: listing.property?.numberBathrooms || 0,
      price: listing.price,
      propertyType: listing.property?.type?.name,
      classification: listing.property?.classification?.name,
      priceType: listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency,
      address: {
        street: listing.property?.address?.street,
        city: listing.property?.address?.city,
        postcode: listing.property?.address?.postcode
      },
      image: listing.property?.media,
      hasNote: hasNote(listing.id),
      isFavorite: isFavourite(listing.id)
    }))
    .filter((m) => m.lat !== 0 && m.lon !== 0) || []];
});

// Calculate zoom level based on radius
const mapZoomLevel = computed(() => {
  if (!searchParams.value?.radius) return 14; // Default zoom if no radius is specified (higher zoom)

  // Map radius values to appropriate zoom levels - higher minimum as requested
  // Lower zoom value = more zoomed out
  const radius = Number(searchParams.value.radius);

  if (radius === 0) return 16;      // This location only - very zoomed in
  else if (radius <= 0.25) return 15;
  else if (radius <= 0.5) return 14;
  else if (radius <= 1) return 13;
  else if (radius <= 2) return 12;  // Min recommended zoom
  else if (radius <= 5) return 12;  // Min recommended zoom
  else if (radius <= 10) return 12; // Min recommended zoom 
  else if (radius <= 20) return 11;
  else return 10;                   // 40+ miles - more zoomed out, but not too far
});

watch(searchParams, () => {
  if (searchParams.value) {
    console.log("searchParams", searchParams.value);
    console.log("Current map zoom level:", mapZoomLevel.value);
  }
})
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

/* Full page map view */
.map-view-fullpage {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.map-fullpage {
  height: 700px;
  width: 100%;
}

/* Dual view layout */
.dual-view-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  width: 100vw;
  height: calc(100vh - var(--header-height) - 160px);
  /* Subtract header height and view toggle container */
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

/* Prevent body scrolling when in map view */
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