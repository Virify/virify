<template>
  <div class="area-search-page">
    <div class="map-container">
      <div class="header-row">
        <h1>Area Search</h1>
        <NuxtLink to="/sandbox" class="back-link">← Back to Sandbox</NuxtLink>
      </div>

      <div class="instructions">
        <p>
          <strong>Draw a custom search area:</strong> Use the polygon tool to draw a custom area on the map,
          then search for properties within that area.
        </p>
      </div>

      <div class="controls">
        <div class="button-group">
          <AtomsButton @click="toggleDrawing" :class="{ active: drawingEnabled }">
            {{ drawingEnabled ? 'Cancel Drawing' : 'Draw Search Area' }}
          </AtomsButton>
          <AtomsButton @click="clearArea" variant="secondary" :disabled="!hasDrawnArea">
            Clear Area
          </AtomsButton>
        </div>
      </div>

      <div class="map-wrapper">
        <OrganismsMap ref="mapRef" :mapId="'area-search-map'" :center="mapCenter" :zoom="12" :interactive="true"
          :drawingEnabled="drawingEnabled" :drawingMode="'polygon'" @shape-drawn="handleShapeDrawn"
          @shape-updated="handleShapeUpdated" @shape-deleted="handleShapeDeleted" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Map configuration
const mapRef = ref<any>(null);
const mapCenter = ref({ lat: 51.5074, lon: -0.1278 });
const drawingEnabled = ref(false);
const drawnShape = ref<GeoJSONFeature | null>(null);
const searchPerformed = ref(false);

// Computed properties
const hasDrawnArea = computed(() => drawnShape.value !== null);

// Toggle drawing mode
function toggleDrawing() {
  drawingEnabled.value = !drawingEnabled.value;

  // If drawing is disabled and we have a shape, consider it complete
  if (!drawingEnabled.value && drawnShape.value) {
    console.log('Drawing completed with shape:', drawnShape.value);
  }
}

// Clear the drawn area
function clearArea() {
  if (mapRef.value?.clearDrawings) {
    mapRef.value.clearDrawings();
    drawnShape.value = null;
    searchPerformed.value = false;
    console.log('Search area cleared');
  }
}

// Handle drawn shapes
function handleShapeDrawn(feature: GeoJSONFeature) {
  console.log('Area drawn:', feature);
  drawnShape.value = feature;
}

// Handle shape updates
function handleShapeUpdated(feature: GeoJSONFeature) {
  console.log('Area updated:', feature);
  drawnShape.value = feature;
}

// Handle shape deletion
function handleShapeDeleted() {
  console.log('Area deleted');
  drawnShape.value = null;
  searchPerformed.value = false;
}
</script>

<style scoped>
.area-search-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-link {
  font-size: 14px;
  color: #3388ff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
}

.back-link:hover {
  text-decoration: underline;
}

.instructions {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #3388ff;
}

.controls {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button-group button.active {
  background-color: #3388ff;
  color: white;
}

.map-wrapper {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.area-info {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-results {
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.property-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.2s;
}

.property-card:hover {
  transform: translateY(-2px);
}

.property-image {
  height: 150px;
  background-color: #e0e0e0;
  background-image: linear-gradient(45deg, #f5f7fa 25%, #e0e0e0 25%, #e0e0e0 50%, #f5f7fa 50%, #f5f7fa 75%, #e0e0e0 75%, #e0e0e0);
  background-size: 20px 20px;
}

.property-info {
  padding: 15px;
}

.property-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.property-info p {
  margin: 5px 0;
  color: #555;
}
</style>
