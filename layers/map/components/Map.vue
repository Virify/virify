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
import { useDebounceFn } from '@vueuse/core';

/**
 * state
 */
const map = shallowRef();
const mapContainer = ref<HTMLElement>();
const {
  initMap,
  addMarker,
  addMarkers,
  clearMarkers,
  clearClusters,
  initDrawing,
  updateSearchRadiusVisualization,
  removeSearchRadiusVisualization
} = useMap();

defineExpose({ 
  map,
  recenterMap
});

/**
 * props & emits
 */
const props = withDefaults(defineProps<{
  center?: [number, number]; // [lon, lat]
  zoom?: number;
  interactive?: boolean;
  mapId?: string;
  markers?: ListingCardType[];
  listingView?: boolean
  draw?: boolean;
  searchRadius?: number | null;
  searchCenter?: [number, number] | null;
}>(), {
  interactive: true,
  zoom: 5, // Zoom level to show entire UK
  center: () => [-2.5, 54.7], // Geographic center of UK [lon, lat]
  draw: false,
  searchRadius: null,
  searchCenter: null,
});

const emit = defineEmits<{
  'map-ready': [map: any];
  'zoom-changed': [zoom: number];
  'center-changed': [center: [number, number]];
  'bounds-changed': [bounds: [number, number, number, number]];
  'viewport-changed': [viewport: { zoom: number; center: [number, number]; bounds: [number, number, number, number] }];
}>();

onMounted(() => {
  loadMap();
  nextTick(() => {
    removeCircle(map.value);
    if (map.value) {
      map.value.resize();
      initDrawing(map.value, props.draw);
      
      // Add event listeners for map interactions
      setupMapEventListeners();
      
      // Emit map ready event
      emit('map-ready', map.value);
    }
  });
});

// Set up event listeners to track map interactions
const setupMapEventListeners = () => {
  if (!map.value || !props.interactive) return;
  
  // Debounced event handler to avoid too many state updates
  const debouncedEmitViewport = useDebounceFn(() => {
    if (!map.value) return;
    
    const zoom = map.value.getZoom();
    const center = map.value.getCenter();
    const bounds = map.value.getBounds();
    
    // Convert to expected format
    const centerArray: [number, number] = [center.lng, center.lat];
    const boundsArray: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(), 
      bounds.getEast(),
      bounds.getNorth()
    ];
    
    // Emit individual events
    emit('zoom-changed', zoom);
    emit('center-changed', centerArray);
    emit('bounds-changed', boundsArray);
    
    // Emit combined viewport event for convenience
    emit('viewport-changed', {
      zoom,
      center: centerArray,
      bounds: boundsArray
    });
  }, 500); // 500ms debounce
  
  // Listen to zoom and move events
  map.value.on('zoomend', debouncedEmitViewport);
  map.value.on('moveend', debouncedEmitViewport);
  
  // Store cleanup function for later
  (map.value as any)._cleanupViewportListeners = () => {
    map.value.off('zoomend', debouncedEmitViewport);
    map.value.off('moveend', debouncedEmitViewport);
  };
};

// Cleanup event listeners on unmount
onUnmounted(() => {
  if (map.value && (map.value as any)._cleanupViewportListeners) {
    (map.value as any)._cleanupViewportListeners();
  }
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
      props.mapId
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

  const { markers = [], listingView } = props

  clearMarkers(map.value, true);

  // If no listing view, add any number of markers provided
  if (!listingView) {
    addMarkers(map.value, markers);

    return
  }

  // Remove any clusters from the map
  clearClusters(map.value)

  // Add get the first marker...
  const [firstMarker] = asArray(markers)

  // And if it exists, add it to the map
  if (firstMarker) addMarker(map.value, firstMarker);
}

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