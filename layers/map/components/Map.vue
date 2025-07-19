<template>
  <div ref="mapContainer" class="map-container">
    <!-- map here -->
    
    <!-- Custom Draw Controls -->
    <MoleculesMapDrawControls
      :draw-enabled="props.draw"
      :map="map"
    />
  </div>
</template>
<script setup lang="ts">
/**
 * state
 */
const map = shallowRef();
const mapContainer = ref<HTMLElement>();
const { 
  initMap, 
  addMarkers,
  clearMarkers, 
  addMarker, 
  initDrawing, 
  getDrawControl, 
  updateSearchRadiusVisualization, 
  removeSearchRadiusVisualization
} = useMap();

defineExpose({ 
  map,
  recenterMap
});

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
  draw?: boolean;
  searchRadius?: number | null;
  searchCenter?: [number, number] | null;
}>(), {
  interactive: true,
  zoom: 5, // Zoom level to show entire UK
  mapId: GLOBAL_MAP_ID,
  center: () => [-2.5, 54.7], // Geographic center of UK [lon, lat]
  draw: false,
  searchRadius: null,
  searchCenter: null,
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
 * Use jumpTo for initial positioning, flyTo for subsequent updates
 */
const isInitialLoad = ref(true);

watch(
  [() => props.zoom, () => props.center],
  ([newZoom, newCenter]) => {
    if (!map.value) return;
    
    if (newCenter !== undefined) {
      if (isInitialLoad.value) {
        // Use jumpTo for immediate positioning on initial load (no animation)
        map.value.jumpTo({
          center: newCenter,
          zoom: newZoom !== undefined ? newZoom : map.value.getZoom(),
          animate: false
        });
        isInitialLoad.value = false;
      } else {
        // Use flyTo for smooth animation on subsequent changes
        map.value.flyTo({
          center: newCenter,
          zoom: newZoom !== undefined ? newZoom : map.value.getZoom(),
          essential: true,
          duration: 600  // Reduced duration for faster transitions
        });
      }
    } else if (newZoom !== undefined) {
      if (isInitialLoad.value) {
        // Use setZoom for immediate zoom on initial load
        map.value.setZoom(newZoom);
        isInitialLoad.value = false;
      } else {
        // Use flyTo for smooth zoom animation on subsequent changes
        map.value.flyTo({
          zoom: newZoom,
          essential: true,
          duration: 400  // Reduced duration for faster zoom
        });
      }
    }
  }
);

/**
 * Watch for changes in search radius and center
 * Update the map visualization accordingly
 */
watch(
  [() => props.searchRadius, () => props.searchCenter, () => map.value],
  ([radius, center, mapInstance]) => {
    
    if (!mapInstance) return;
    if (center) {
      updateSearchRadiusVisualization(mapInstance, center, Number(radius));
    }
  },
  { immediate: true }
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
    
    // Reset the initial load flag after a short delay to allow the watcher to handle initial positioning
    nextTick(() => {
      setTimeout(() => {
        isInitialLoad.value = false;
      }, 100);
    });
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
  } else if (props.marker && formattedMarkers.value[0]) {
    addMarker(map.value, [formattedMarkers.value[0]]);
  }
}

/**
 * Format the single marker
 * 
 * @param listing
 */
function formatMarker(listing: ListingCardType): MapMarker {
  return {
    id: listing.id,
    lat: listing.property?.address?.lat ?? 0,
    lon: listing.property?.address?.lon ?? 0,
    title: listing.title ?? null,
    bedrooms: listing.property?.numberBedrooms ?? null,
    bathrooms: listing.property?.numberBathrooms ?? null,
    receptions: listing.property?.numberReceptions ?? null,
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
    tier: listing.listingTier,
  };
}

/**
 * Format the markers for the map
 * 
 * @returns {Array} - Array of formatted markers
 */
const formattedMarkers = computed(() => {
  if (props.markers) return props.markers.map(listing => formatMarker(listing));
  if (props.marker) return [formatMarker(props.marker)];
  return [];
});

/**
 * Remove the search radius visualization from the map
 */
function removeCircle(map: any) {
  if (!map) return;
  // Remove SVG overlay using composable util
  removeSearchRadiusVisualization(map);
}

/**
 * Recenter the map to ensure marker is properly positioned
 */
function recenterMap() {
  if (!map.value || !props.center) return;
  
  nextTick(() => {
    map.value.resize();
    map.value.flyTo({
      center: props.center,
      zoom: props.zoom || map.value.getZoom(),
      essential: true,
      duration: 800
    });
  });
}
</script>
<style lang="scss">
@import '@maptiler/sdk/dist/maptiler-sdk.css';
@import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>