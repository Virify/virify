<template>
  <div v-if="hasValidCoordinates" ref="mapContainer"
    :class="['maptiler-map', interactive ? 'maptiler-map-interactive' : 'maptiler-map-static']"
    style="height: 500px; width: 100%"></div>
  <div v-else class="map-placeholder">
    <div class="map-placeholder-content">
      <span>Location information not available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../shared/types/map-coordinates';

const {
  sdk,
  initializeMap,
  addMarkersToMap,
  hasValidCoordinates: checkValidCoordinates,
  addInteractiveIndicator,
  setupEventHandlers
} = useMapTiler();

const props = defineProps<{
  markers?: MapMarker[];
  lat?: number;
  lon?: number;
  zoom?: number;
  interactive?: boolean;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let markerElements: any[] = [];
let cleanupEventHandlers: (() => void) | null = null;

// Check if we have valid coordinates to display a map
const hasValidCoordinates = computed(() =>
  checkValidCoordinates(props.markers, props.lat, props.lon)
);

// Function to handle map resize
const handleResize = () => {
  if (map) {
    map.resize();
  }
};

onMounted(() => {
  if (!mapContainer.value || !hasValidCoordinates.value) return;

  // Add resize event listener
  window.addEventListener('resize', handleResize);

  // Set up event handlers for non-interactive maps
  cleanupEventHandlers = setupEventHandlers(mapContainer.value, !!props.interactive);

  // Create map instance
  map = initializeMap(
    mapContainer.value,
    { 
      interactive: !!props.interactive, 
      zoom: props.zoom
    },
    props.markers,
    props.lat,
    props.lon
  );

  if (!map) return;

  // Add markers after the map has loaded
  map.on('load', () => {
    // Add markers to the map
    markerElements = addMarkersToMap(map, props.markers, props.lat, props.lon);

    // Add interactive indicator if the map is interactive
    if (props.interactive && mapContainer.value) {
      addInteractiveIndicator(mapContainer.value);
    }
  });
});

// Clean up on component destruction
onBeforeUnmount(() => {
  // Remove resize event listener
  window.removeEventListener('resize', handleResize);

  // Clean up event handlers
  if (cleanupEventHandlers) {
    cleanupEventHandlers();
  }

  if (map) {
    // Remove markers
    if (markerElements.length) {
      markerElements.forEach(marker => marker.remove());
    }
    // Remove map
    map.remove();
    map = null;
  }
});

// Watch for changes in props that require map updates
watch(() => props.markers, () => {
  if (!map) return;

  // Remove existing markers
  if (markerElements.length) {
    markerElements.forEach(marker => marker.remove());
  }

  // Add new markers
  markerElements = addMarkersToMap(map, props.markers, props.lat, props.lon);
}, { deep: true });

// Watch for changes in lat/lon
watch(() => [props.lat, props.lon], () => {
  if (!map) return;

  // Update center if single lat/lon changes
  if (props.lat !== undefined && props.lon !== undefined) {
    map.setCenter([props.lon, props.lat]);
  }
});
</script>

<style>
.maptiler-map {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.maptiler-map-interactive {
  cursor: grab;
}

.maptiler-map-interactive:active {
  cursor: grabbing;
}

.maptiler-map-static {
  cursor: default;
}

.maptiler-map-static::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
  /* Higher z-index to be above all map controls */
  pointer-events: auto;
  /* Capture all events to prevent map interaction */
}

.marker-popup {
  padding: 8px;
  max-width: 200px;
}

.marker-popup strong {
  font-size: 14px;
  display: block;
  margin-bottom: 6px;
  color: var(--color-text-primary, #000);
}

.marker-popup div {
  font-size: 12px;
  margin-bottom: 4px;
  color: var(--color-text-secondary, #333);
}

.marker-popup a {
  display: block;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: var(--color-primary, #0066cc);
  color: var(--color-text-on-primary, white);
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.marker-popup a:hover {
  background-color: var(--color-primary-dark, #0055aa);
}

/* Show controls for interactive maps, hide for non-interactive */
.maptiler-map-static .maplibregl-control-container {
  display: none !important;
}

/* Map control styling */
.maplibregl-ctrl-group {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin: 10px;
  background-color: white;
}

.maplibregl-ctrl-group button {
  width: 32px;
  height: 32px;
}

/* Ensure controls are positioned correctly */
.maplibregl-ctrl-top-right {
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.maplibregl-ctrl-bottom-right {
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}



/* MapTiler marker styling */
.maplibregl-marker {
  cursor: pointer;
}

/* Price marker styling */
.price-marker {
  background-color: var(--color-primary, #0066cc);
  color: var(--color-text-on-primary, white);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  display: flex;
  justify-content: center;
  text-align: center;
}

/* Cluster styling */
.map-cluster {
  color: white;
  background: var(--color-primary, #0066cc);
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

/* Style popups */
.maplibregl-popup-content {
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2);
  background-color: var(--color-background, white);
  color: var(--color-text-primary, #000);
}

.custom-popup .maplibregl-popup-content {
  border-top: 3px solid var(--color-primary, #0066cc);
}

.maplibregl-popup-tip {
  border-top-color: var(--color-background, white) !important;
}

.maplibregl-popup {
  z-index: 100;
  /* Ensure popups appear above other elements */
}

/* Map placeholder when coordinates are not available */
.map-placeholder {
  height: 350px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.map-placeholder-content {
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* Interactive map indicator */
.interactive-map-indicator {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 10;
  opacity: 0.8;
  transition: opacity 1s ease;
}

.interactive-map-indicator.fade-out {
  opacity: 0;
}
</style>
