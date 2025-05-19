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
          <AtomsButton @click="searchProperties" variant="primary" :disabled="!hasDrawnArea || isLoading">
            {{ isLoading ? 'Searching...' : 'Search Properties' }}
          </AtomsButton>
        </div>
      </div>

      <div class="map-wrapper">
        <OrganismsMap ref="mapRef" :mapId="'area-search-map'" :center="mapCenterCoordinates" :zoom="12" :interactive="true"
          :drawingEnabled="drawingEnabled" :drawingMode="'polygon'" 
          :markers="mapMarkers" @shape-drawn="handleShapeDrawn"
          @shape-updated="handleShapeUpdated" @shape-deleted="handleShapeDeleted"
           />
      </div>

      <!-- Results area -->
      <div v-if="searchPerformed" class="search-results">
        <div class="area-info">
          <h3>Search Results</h3>
          <p v-if="properties.length === 0">No properties found in the selected area.</p>
          <p v-else>{{ properties.length }} properties found in the selected area.</p>
        </div>

        <!-- Property grid -->
        <div v-if="properties.length > 0" class="property-grid">
          <div v-for="property in properties" :key="property.id" class="property-card">
            <div class="property-image" :style="property.property?.media && property.property.media.length > 0 ? 
                `background-image: url(${property.property?.media[0]?.image})` : ''">
            </div>
            <div class="property-info">
              <h4>{{ property.title }}</h4>
              <p><strong>£{{ property.price.toLocaleString() }}</strong> 
                {{ property.rentalListing ? '/ ' + property.rentalListing.rentFrequency : '' }}
              </p>
              <p>{{ property.property?.numberBedrooms || 0 }} bed • 
                 {{ property.property?.numberBathrooms || 0 }} bath</p>
              <p>{{ property.property?.address?.street }}, {{ property.property?.address?.city }}</p>
              <p>{{ property.property?.address?.postcode }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GeoJSONFeature } from '@maptiler/sdk';
import type { ListingCardType } from '~~/shared/types/listing';

// Map configuration
const mapRef = ref<any>(null);
const mapCenter = ref({ lat: 51.477962, lon: -3.177095 });
const drawingEnabled = ref(false);
const drawnShape = ref<GeoJSONFeature | null>(null);
const searchPerformed = ref(false);
const isLoading = ref(false);
const properties = ref<ListingCardType[]>([]);

// Define the type of search - could be made selectable in the UI
const searchType = ref<'rent' | 'buy'>('rent');

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

// Search for properties within the drawn area
async function searchProperties() {
  if (!drawnShape.value) return;
  
  try {
    isLoading.value = true;
    
    // Get all shapes from the map (allows for multiple polygons)
    const polygons = mapRef.value?.getDrawnShapes?.() || [];
    if (polygons.length === 0 && drawnShape.value) {
      // Fallback to single shape if getDrawnShapes doesn't return anything
      polygons.push(drawnShape.value);
    }
    
    // Create search request
    const searchRequest = {
      buyOrRent: searchType.value,
      polygons: polygons,
      // You can add filters here
      bedrooms: [0, 10], // Example range
      bathrooms: [0, 10], // Example range
      priceRange: searchType.value === 'rent' ? [0, 10000] : [0, 10000000], // Example range
    };
    
    console.log('Searching with request:', searchRequest);
    
    // Make API request to the new endpoint
    const result = await $fetch('/api/search/listings-by-polygon', {
      method: 'POST',
      body: searchRequest
    });
    
    // Update the results
    properties.value = result as ListingCardType[];
    searchPerformed.value = true;
    console.log(`Found ${properties.value.length} properties in the drawn area`);
    
  } catch (error) {
    console.error('Error searching for properties:', error);
  } finally {
    isLoading.value = false;
  }
}

// Create map markers from listings
const mapMarkers = computed<MapMarker[]>(() => {
  if (!properties.value?.length) return [];

  return properties.value.map(listing => ({
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
    address: listing.property?.address ? {
      street: listing.property.address.street,
      city: listing.property.address.city,
      postcode: listing.property.address.postcode,
    } : null,
    image: listing.property?.media ?? [],
  }));
});

const mapCenterCoordinates = computed(() => {
  const m = mapMarkers.value[0];
  return m ? { lat: m.lat, lon: m.lon } : mapCenter.value;
});
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
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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
