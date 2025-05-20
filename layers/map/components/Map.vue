<template>
  <div ref="mapContainer" class="map-container">
    <!-- map here -->
  </div>
</template>
<script setup lang="ts">
const { isFavourite } = useFavourites();
const { hasNote } = useNotes();
/**
 * state
 */
const map = shallowRef();
const mapContainer = ref<HTMLElement>();
const { initMap, addMarkers, clearMarkers, addMarker } = useMap();

/**
 * props
 */
const props = withDefaults(defineProps<{
  center?: { lat: number; lon: number };
  zoom?: number;
  interactive?: boolean;
  mapId?: string;
  markers?: ListingCardType[];
  marker?: ListingCardType;
  popups?: boolean;
}>(), {
  interactive: true,
  zoom: 12,
  mapId: GLOBAL_MAP_ID,
  popups: true,
});

/**
 * Load the map and add markers on mount
 */
onMounted(() => {
  loadMap();
  updateMarkers();
});


/**
 * Watch for changes in markers and update the map
 * if the map is already initialized  
 */
watchEffect(() => {
  updateMarkers();
});

/**
 * Watch for changes in the zoom
 */
watch(() => props.zoom, (newZoom) => {
  if (map.value) {
    map.value.setZoom(newZoom);
  }
});

/**
 * Initialise the map
 */
function loadMap() {
  if (mapContainer.value) {
    map.value = initMap(
      mapContainer.value,
      {
        interactive: props.interactive,
        zoom: props.zoom,
        center: props.center,
      },
      props.mapId ?? GLOBAL_MAP_ID,
    );
  }
}

/**
 * Update the markers on the map
 */
function updateMarkers() {
  if (!map.value) return;

  clearMarkers(map.value);

  if (props.markers?.length) {
    addMarkers(map.value, formattedMarkers.value);
  } else if (props.marker) {
    addMarker(map.value, formattedMarkers.value);
  }
}

/**
 * Format the single marker
 * 
 * @param listing
 */
function formatMarker(listing: ListingCardType) {
  return {
    id: listing.id,
    lat: listing.property?.address?.lat ?? 0,
    lon: listing.property?.address?.lon ?? 0,
    title: listing.title ?? null,
    bedrooms: listing.property?.numberBedrooms ?? null,
    bathrooms: listing.property?.numberBathrooms ?? null,
    price: listing.price ?? null,
    propertyType: listing.property?.type?.name ?? null,
    classification: listing.property?.classification?.name ?? null,
    priceType: listing.saleListing?.priceType ?? listing.rentalListing?.rentFrequency ?? null,
    address: listing.property?.address
      ? {
          street: listing.property.address.street,
          city: listing.property.address.city,
          postcode: listing.property.address.postcode,
        }
      : null,
    image: listing.property?.media ?? [],
    isFavorite: isFavourite(listing.id),
    hasNote: hasNote(listing.id),
  };
}

/**
 * Format the markers for the map
 * 
 * @returns {Array} - Array of formatted markers
 */
const formattedMarkers = computed(() => {
  if (props.markers) return props.markers.map(formatMarker);
  if (props.marker) return [formatMarker(props.marker)];
  return [];
});
</script>
<style>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>