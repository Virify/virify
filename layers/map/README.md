# Map Layer

## Overview
The map layer integrates MapTiler SDK for interactive property mapping functionality in the Virify platform. It provides comprehensive mapping features including property visualization, custom markers, interactive popups, and polygon drawing capabilities for area-based searches.

## Features
- 🗺️ Interactive property maps with MapTiler SDK integration
- 💰 Custom price markers with favorite and note indicators
- 🏠 Detailed property popups with images and information
- 🎯 Smart map positioning and zoom based on search radius
- 📱 Responsive map controls with zoom functionality
- 🔄 Efficient marker caching and map instance reuse
- ✏️ Polygon drawing for area-based property searches
- 🔍 Geocoding and address autocomplete
- 📐 Distance and area calculations

## Directory Structure
- `components/`: Map-related Vue components
  - `molecules/`: Reusable map components
    - `MoleculesMarkerPopup.vue`: Property details popup component
    - `MoleculesPriceMarker.vue`: Custom price marker component
  - `OrganismsMap.vue`: Main map component with drawing support
- `composables/`: Map utility functions
  - `useMapTiler.ts`: Core map functionality composable
- `plugins/`: MapTiler SDK integration
  - `maptiler.client.ts`: Client-side MapTiler initialization
- `pages/`: Map-specific pages
  - Map search and area selection pages
- `utils/`: Map utility functions
  - Geocoding helpers
  - Coordinate calculations

## Setup

### Prerequisites
- MapTiler API key (https://www.maptiler.com/)

### Configuration
1. Add your MapTiler API key to `.env`:
```env
MAPTILER_API_KEY=your_api_key
```

2. The layer will automatically integrate with your Nuxt application through the module config in `nuxt.config.ts`.

## Usage

### Advanced Map with Drawing
```vue
<template>
  <OrganismsMap
    :markers="propertyMarkers"
    :zoom="12"
    :interactive="true"
    :display-popups="true"
    :drawing-enabled="true"
    :drawing-mode="'polygon'"
    @property-note="handleNote"
    @property-favourite="handleFavorite"
    @shape-drawn="handleAreaSearch"
    @shape-updated="handleAreaUpdate"
    @shape-deleted="handleAreaClear"
  />
</template>

<script setup>
function handleAreaSearch(feature) {
  // Perform property search within drawn polygon
  const coordinates = feature.geometry.coordinates[0];
  searchPropertiesInArea(coordinates);
}
</script>
```
```

### Map Marker Structure
```ts
const mapMarker = {
  id: number,
  lat: number,
  lon: number,
  title: string,
  price: number,
  propertyType: string,
  classification: string,
  address: {
    street: string,
    city: string,
    postcode: string
  },
  hasNote: boolean,
  isFavorite: boolean
}
```

### Map Composable Functions
```ts
const { 
  initializeMap,                    // Create or reuse a map instance
  addMarker,                        // Add a property marker to the map
  clearMarkers,                     // Remove all markers from the map
  centerMap,                        // Center map on specific coordinates
  autoComplete,                     // Geocoding search functionality
  calculateZoomLevelFromRadius,     // Calculate appropriate zoom level
  initDrawing,                      // Enable/disable polygon drawing
  getDrawnShapes,                   // Get all drawn polygon shapes
  clearDrawnShapes                  // Clear all drawn shapes
} = useMapTiler()
```

### Geocoding and Search
```ts
// Address autocomplete
const suggestions = await autoComplete(searchQuery);

// Reverse geocoding
const address = await reverseGeocode(latitude, longitude);

// Area-based property search
const properties = await searchPropertiesInPolygon(polygonCoordinates);
```

## Best Practices
- **Map Instance Management**: Use the `GLOBAL_MAP_ID` constant to share map instances across pages
- **Performance**: Handle map visibility changes by resizing the map appropriately
- **Error Handling**: Provide fallback UI for when coordinates are not available
- **Memory Management**: Properly clean up markers before adding new ones
- **Caching**: Use the marker cache to optimize performance
- **Validation**: Always validate coordinates before displaying them
- **User Experience**: Provide clear drawing instructions and feedback
- **Responsive Design**: Ensure maps work well on all device sizes
- **Accessibility**: Include appropriate ARIA labels and keyboard navigation

# Map Drawing Implementation

The map drawing functionality has been simplified to use only the standard MapboxDraw polygon drawing feature.

## How It Works

1. We use the standard MapboxDraw library with its built-in polygon drawing mode
2. Drawing is initialized via the `initDrawing` function in the `useMapTiler` composable
3. The drawing function supports:
   - Drawing polygons by clicking multiple points and double-clicking to finish
   - Getting all drawn shapes via `getDrawnShapes`
   - Clearing all shapes via `clearDrawnShapes`

## Usage

There are two ways to use the drawing functionality:

### 1. Using OrganismsMap Component (Recommended)

```vue
<template>
  <OrganismsMap
    :center="mapCenter"
    :zoom="13"
    :interactive="true"
    :drawingEnabled="true"
    :drawingMode="'polygon'"
    @shape-drawn="handleShapeDrawn"
    @shape-updated="handleShapeUpdated"
    @shape-deleted="handleShapeDeleted"
  />
</template>

<script setup>
function handleShapeDrawn(feature) {
  console.log('Shape drawn:', feature);
}

function handleShapeUpdated(feature) {
  console.log('Shape updated:', feature);
}

function handleShapeDeleted(features) {
  console.log('Shape deleted:', features);
}
</script>
```

### 2. Using the useMapTiler Composable Directly

```typescript
import { useMapTiler } from '~/layers/map/composables/useMapTiler';

// In your component setup function
const { initializeMap, initDrawing, getDrawnShapes, clearDrawnShapes } = useMapTiler();

// Initialize map
const map = initializeMap(mapContainerElement);

// Enable polygon drawing
initDrawing(map, 'polygon');

// To disable drawing
initDrawing(map, null);

// To get drawn shapes
const shapes = getDrawnShapes(map);

// To clear all shapes
clearDrawnShapes(map);
```

This simplified implementation makes it easier to maintain and extend the map functionality.
