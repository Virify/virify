<template>
  <div ref="mapContainer" class="map-container">
    <!-- map here -->
    
    <!-- Custom Draw Controls -->
    <MoleculesMapDrawControls
      :draw-enabled="props.draw"
      :is-drawing="drawingState.isDrawing"
      :has-drawn-shapes="drawingState.hasShapes"
      :has-selected-shape="drawingState.hasSelectedShape"
      @toggle-polygon-drawing="handleTogglePolygonDrawing"
      @delete-all-shapes="handleDeleteAllShapes"
      @delete-selected-shape="handleDeleteSelectedShape"
    />
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
const { initMap, addMarkers, clearMarkers, addMarker, initDrawing, getDrawControl, updateSearchRadiusVisualization, removeSearchRadiusVisualization, clearMarkersForFeature } = useMap();

// Drawing state management
const drawingState = reactive({
  isDrawing: false,
  hasShapes: false,
  hasSelectedShape: false,
});

defineExpose({ 
  map, 
  mapContainer, 
  drawingState, 
  handleTogglePolygonDrawing, 
  handleDeleteAllShapes,
  handleDeleteSelectedShape 
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
      
      if (newDrawValue) {
        // Add event listeners for draw events to sync state
        map.value.on('draw.create', (e: any) => {
          drawingState.hasShapes = true;
          drawingState.isDrawing = false; // Exit draw mode after creating
        });
        
        map.value.on('draw.delete', (e: any) => {
          // Clear markers for deleted features
          e.features.forEach((feature: any) => {
            if (feature.id) {
              clearMarkersForFeature(map.value, feature.id);
            }
          });
          
          const drawControl = getDrawControl(map.value);
          if (drawControl) {
            const allFeatures = drawControl.getAll();
            drawingState.hasShapes = allFeatures.features.length > 0;
            drawingState.hasSelectedShape = false; // Reset selection after delete
          }
        });
        
        map.value.on('draw.modechange', (e: any) => {
          drawingState.isDrawing = e.mode === 'draw_polygon';
        });

        // Track selection changes
        map.value.on('draw.selectionchange', (e: any) => {
          drawingState.hasSelectedShape = e.features && e.features.length > 0;
        });
      }
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
  // Remove SVG overlay using composable util
  removeSearchRadiusVisualization(map);
}

/**
 * Handle polygon drawing toggle from custom controls
 */
function handleTogglePolygonDrawing() {
  if (!map.value) return;
  
  const drawControl = getDrawControl(map.value);
  if (!drawControl) return;
  
  drawingState.isDrawing = !drawingState.isDrawing;
  
  if (drawingState.isDrawing) {
    drawControl.changeMode('draw_polygon');
  } else {
    drawControl.changeMode('simple_select');
  }
}

/**
 * Handle delete all shapes from custom controls
 */
function handleDeleteAllShapes() {
  if (!map.value) return;
  
  const drawControl = getDrawControl(map.value);
  if (!drawControl) return;
  
  // Get all features before deleting to clear their markers
  const allFeatures = drawControl.getAll();
  allFeatures.features.forEach((feature: any) => {
    if (feature.id) {
      clearMarkersForFeature(map.value, feature.id);
    }
  });
  
  // Also clear all general markers on the map
  clearMarkers(map.value);
  
  drawControl.deleteAll();
  drawingState.hasShapes = false;
  drawingState.hasSelectedShape = false;
}

/**
 * Handle delete selected shape from custom controls
 */
function handleDeleteSelectedShape() {
  if (!map.value) return;
  
  const drawControl = getDrawControl(map.value);
  if (!drawControl) return;
  
  // Get selected features
  const selectedFeatures = drawControl.getSelected();
  if (selectedFeatures.features && selectedFeatures.features.length > 0) {
    // Clear markers for selected features
    selectedFeatures.features.forEach((feature: any) => {
      if (feature.id) {
        clearMarkersForFeature(map.value, feature.id);
      }
    });
    
    // Delete selected features
    const selectedIds = selectedFeatures.features.map((f: any) => f.id);
    drawControl.delete(selectedIds);
    
    // Update state
    const remainingFeatures = drawControl.getAll();
    drawingState.hasShapes = remainingFeatures.features.length > 0;
    drawingState.hasSelectedShape = false;
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