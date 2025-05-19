# Map Layer

## Overview
The map layer integrates MapTiler SDK for interactive property mapping functionality in the Virify platform. It provides features for displaying property locations, custom markers with pricing information, and interactive property details popups.

## Features
- 🗺️ Interactive property maps with MapTiler SDK integration
- 💰 Custom price markers with favorite and note indicators
- 🏠 Detailed property popups with images and information
- 🎯 Smart map positioning and zoom based on search radius
- 📱 Responsive map controls with zoom functionality
- 🔄 Efficient marker caching and map instance reuse

## Directory Structure
- `components/`: Map-related Vue components
  - `molecules/`: Reusable map components
    - `MoleculesMarkerPopup.vue`: Property details popup component
    - `MoleculesPriceMarker.vue`: Custom price marker component
  - `OrganismsMap.vue`: Main map component
- `composables/`: Map utility functions
  - `useMapTiler.ts`: Core map functionality composable
- `plugins/`: MapTiler SDK integration
  - `maptiler.client.ts`: Client-side MapTiler initialization

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

### Basic Map Integration
```vue
<template>
  <OrganismsMap
    :markers="propertyMarkers"
    :zoom="12"
    :interactive="true"
    :display-popups="true"
    @property-note="handleNote"
    @property-favourite="handleFavorite"
  />
</template>
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
  initializeMap,    // Create or reuse a map instance
  addMarker,        // Add a property marker to the map
  clearMarkers,     // Remove all markers from the map
  centerMap,        // Center map on specific coordinates
  autoComplete,     // Geocoding search functionality
  calculateZoomLevelFromRadius  // Calculate appropriate zoom level
} = useMapTiler()
```

## Best Practices
- Use the `GLOBAL_MAP_ID` constant to share map instances across pages
- Handle map visibility changes by resizing the map appropriately
- Provide fallback UI for when coordinates are not available
- Properly clean up markers before adding new ones
- Use the marker cache to optimize performance
- Always validate coordinates before displaying them
