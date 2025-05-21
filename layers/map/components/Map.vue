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
const { initMap, addMarkers, clearMarkers, addMarker, initDrawing } = useMap();
defineExpose({ map });

/**
 * props
 */
const props = withDefaults(defineProps<{
  center?: [number, number]; // [lon, lat]
  zoom?: number;
  interactive?: boolean;
  mapId?: string;
  markers?: ListingCardType[];
  marker?: ListingCardType;
  popups?: boolean;
  draw?: boolean;
}>(), {
  interactive: true,
  zoom: 12,
  mapId: GLOBAL_MAP_ID,
  popups: true,
  center: () => [51.505, -0.09],
  draw: false,
});

onMounted(() => {
  loadMap();
  nextTick(() => {
    removeCircle(map.value);
    if (map.value) {
      map.value.resize();
      initDrawing(map.value, props.draw);
    }
  });
});

// Watch for changes in draw prop to add/remove controls
watch(
  () => props.draw,
  (newDrawValue) => {
    if (map.value) {
      initDrawing(map.value, newDrawValue);
    }
  }
);

/**
 * Watch for changes in markers list or favorite/note status
 * Using watchEffect to detect all reactive dependencies while limiting renders
 */
watchEffect(() => {
  updateMarkers();
});

/**
 * Watch for changes in the zoom or center
 * Use flyTo for smoother transitions between locations
 */
watch(
  [() => props.zoom, () => props.center],
  ([newZoom, newCenter]) => {
    if (!map.value) return;
    
    if (newCenter !== undefined) {
      // Use flyTo for smooth animation when center or zoom changes
      map.value.flyTo({
        center: newCenter,
        zoom: newZoom !== undefined ? newZoom : map.value.getZoom(),
        essential: true, // This animation is considered essential for the user experience
        duration: 1000  // Animation duration in milliseconds
      });
    } else if (newZoom !== undefined) {
      // If only zoom changed, just animate zoom
      map.value.flyTo({
        zoom: newZoom,
        essential: true,
        duration: 800
      });
    }
  }
);

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
        center: props.center ?? [0, 0],
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

/**
 * Update the search radius visualization on the map
 * 
 * @param {number} radius - The radius in meters
 */
function removeCircle(map: any) {
  if (!map) return;
  ['search-radius-layer-outline', 'search-radius-layer'].forEach(layerId => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  });
  if (map.getSource('search-radius-source')) {
    map.removeSource('search-radius-source');
  }
}
</script>
<style>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>