<template>
  <div v-if="hasValidCoordinates" ref="mapContainer"
    :class="['maptiler-map', interactive ? 'maptiler-map-interactive' : 'maptiler-map-static', customClass]">
  </div>
  <div v-else class="map-placeholder" :class="customClass">
    <div class="map-placeholder-content">
      <span>Location information not available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../shared/types/map-coordinates';

const emit = defineEmits(['property-note', 'property-favourite']);

const mapTiler = useMapTiler({
  onPropertyNote: (propertyId: number) => emit('property-note', propertyId),
  onPropertyFavourite: (propertyId: number) => emit('property-favourite', propertyId)
});

const {
  sdk,
  initializeMap,
  hasValidCoordinates: checkValidCoordinates,
  addInteractiveIndicator,
  setupEventHandlers,
  centerMapOnCoordinates
} = mapTiler;

const props = defineProps<{
  markers?: MapMarker[];
  lat?: number;
  lon?: number;
  zoom?: number;
  interactive?: boolean;
  customClass?: string;
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
    markerElements = mapTiler.addMarkersToMap(map, props.markers, props.lat, props.lon);

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

// Combined watcher for all prop changes that affect the map
watch(
  [() => props.markers, () => props.lat, () => props.lon, () => props.zoom],
  ([markers, lat, lon, zoom]) => {
    if (!map) return;

    // Handle marker updates
    if (markers) {
      // Remove existing markers
      if (markerElements.length) {
        markerElements.forEach(marker => marker.remove());
        markerElements = [];
      }
      // Add new markers
      markerElements = mapTiler.addMarkersToMap(map, markers ? [...markers] : [], lat, lon);
    }

    // Handle center updates
    if (lat !== undefined && lon !== undefined) {
      // Use the centerMapOnCoordinates function from useMapTiler
      centerMapOnCoordinates(map, lat, lon);
    }

    // Handle zoom updates
    if (zoom !== undefined) {
      map.setZoom(zoom);
    }
  },
  { deep: true, immediate: true }
);
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
  pointer-events: none;
  /* Allow pointer events to pass through static map overlay */
}

.marker-popup {
  padding: 0;
  max-width: 325px !important;
  /* Adjusted width */
  font-family: var(--font-family, system-ui, sans-serif);
  border-radius: var(--border-radius-md, 8px);
  overflow: hidden;
  width: 325px !important;
  /* Force the width */
  background-color: var(--background-100);
  color: var(--text-primary);
}

.marker-popup-image-container {
  width: 100%;
  height: 200px;
  /* Increased from 160px to be proportional with the wider popup */
  overflow: hidden;
  position: relative;
}

.marker-popup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.marker-popup-image:hover {
  transform: scale(1.05);
}

.marker-popup-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: var(--text-primary);
  padding: 12px 12px 0;
}

.marker-popup-address {
  font-size: 12px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-style: italic;
  padding: 0 12px;
}

.marker-popup-info-container {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  margin: 10px 0;
  gap: 15px;
}

.marker-popup-price-column {
  flex: 1;
}

.marker-popup-details-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.marker-popup-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--secondary-500);
  margin-bottom: 2px;
}

.marker-popup-price-type {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.marker-popup-property-type {
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.marker-popup-features {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 0;
}

.marker-popup-actions {
  display: flex;
  gap: 8px;
  margin: 10px 0 0;
  padding: 0 12px 12px;
}

.marker-popup-view-link {
  display: block;
  padding: 8px 12px;
  background-color: var(--secondary-500);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius-sm, 4px);
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  flex-grow: 1;
}

.marker-popup-view-link:hover {
  background-color: var(--secondary-600);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0, 0, 0, 0.2));
}

.marker-popup-notes-button,
.marker-popup-favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--background-200);
  border: none;
  border-radius: var(--border-radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.marker-popup-notes-button:hover,
.marker-popup-favorite-button:hover {
  background-color: var(--background-300);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0, 0, 0, 0.2));
}

/* Selected state for favorites button */
.marker-popup-favorite-button.selected {
  background-color: var(--pink-100);
}

.marker-popup-favorite-button.selected svg {
  fill: var(--pink-500);
  color: var(--pink-500);
}

.marker-popup-button-icon,
.note-button-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

/* Note button styles */
.note-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Has note styling */
.marker-popup-notes-button.has-note {
  background-color: var(--background-200);
}

.marker-popup-notes-button.has-note svg {
  color: var(--secondary-600);
}

/* Has note animation (same as original component) */
.marker-popup-notes-button.has-note .note-button-confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.marker-popup-notes-button-container,
.marker-popup-favorite-button-container {
  position: relative;
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
  background-color: var(--secondary-500);
  color: white;
  font-weight: bold;
  padding: 4px 8px;
  min-width: 50px;
  text-align: center;
  border-radius: var(--border-radius-sm, 4px);
  white-space: nowrap;
  font-size: 12px;
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0, 0, 0, 0.2));
  display: flex;
  justify-content: center;
}

/* Marker content layout */
.price-marker-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-marker-price {
  display: inline-block;
}

/* Status indicators */
.marker-status-container {
  display: flex;
  gap: 2px;
}

.marker-favorite-indicator,
.marker-note-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.marker-favorite-indicator,
.marker-note-indicator {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
}

/* Cluster styling */
.map-cluster {
  color: white;
  background: var(--primary-500);
  border-radius: 50%;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 2px 5px var(--shadow-subtle, rgba(0, 0, 0, 0.3));
}

/* Style MapTiler popups */
.maplibregl-popup-content {
  padding: 0 !important;
  /* Changed from 12px to remove extra padding */
  border-radius: var(--border-radius-lg, 10px);
  box-shadow: 0 4px 20px var(--shadow-medium, rgba(0, 0, 0, 0.15));
  background-color: var(--background-100);
  color: var(--text-primary);
  max-width: 325px !important;
  /* Adjusted width */
  width: auto !important;
  /* Ensure the width adapts to content up to max-width */
  border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.05));
}

.custom-popup .maplibregl-popup-content {
  border-top: 3px solid var(--secondary-500);
}

.maplibregl-popup-tip {
  border-top-color: var(--background-100) !important;
}

.maplibregl-popup {
  z-index: 100;
  /* Ensure popups appear above other elements */
  max-width: 325px !important;
  /* Adjusted width */
}

/* Map placeholder when coordinates are not available */
.map-placeholder {
  width: 100%;
  background-color: var(--background-200);
  border-radius: var(--border-radius-md, 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px var(--shadow-subtle, rgba(0, 0, 0, 0.1));
}

.map-placeholder-content {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Interactive map indicator */
.interactive-map-indicator {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: var(--overlay-dark, rgba(0, 0, 0, 0.7));
  color: var(--text-on-dark);
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
