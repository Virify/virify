# Map Layer

## Overview

The map layer integrates MapTiler SDK for all interactive mapping in Virify. It powers property location display, custom price markers, polygon drawing for area-based search, geocoding/autocomplete, and search radius visualisation.

The main `useMap()` composable is a thin orchestrator that delegates to six focused sub-composables, each handling one concern.

## Directory Structure

```
layers/map/
├── components/
│   ├── Map.vue                          # Root map container with drawing support
│   └── molecules/
│       ├── MoleculesMarkerPopup.vue     # Property popup on marker click
│       ├── MoleculesPriceMarker.vue     # Custom price bubble marker
│       └── MoleculesMapDrawControls.vue # Polygon drawing UI (draw / delete)
├── composables/
│   ├── useMap.ts                        # Orchestrator — combines all sub-composables
│   ├── useInitMap.ts                    # Map instance creation and caching
│   ├── useMapControls.ts               # Zoom, pan, navigation controls
│   ├── useMapMarkers.ts                # Add/remove/cluster markers
│   ├── useMapDraw.ts                   # Polygon drawing mode
│   ├── useMapSDK.ts                    # MapTiler SDK access
│   └── useMapVisualization.ts          # Search radius circle overlay
├── plugins/
│   └── maptiler.client.ts              # SDK initialisation with API key
├── shared/
│   ├── types/                          # Map-specific TypeScript types
│   └── utils/
│       └── useMapSearch.ts             # Geocoding, autocomplete, boundary enhancement
├── utils/
│   ├── calculate.ts                    # Distance and zoom calculations
│   ├── markers.ts                      # Marker data structures
│   ├── poly.ts                         # Polygon coordinate utilities
│   ├── styles.ts                       # Map style helpers
│   ├── create-empty-map-tile.ts        # Placeholder tile generation
│   └── find-map-instance.ts            # Map instance cache lookup
└── nuxt.config.ts
```

## `useMap()` API

```ts
const map = useMap()

// Initialisation
map.initMap()
map.getExistingMap()

// Markers
map.addMarker(marker: MapMarker)
map.addMarkers(markers: MapMarker[])
map.clearMarkers()
map.clearMarkersForFeature(featureId)
map.clearClusters()

// Polygon drawing
map.initDrawing(mapInstance, enabled: boolean)
map.togglePolygonDrawing()
map.deleteAllShapes(mapInstance)
map.deleteSelectedShape(mapInstance)
map.drawingState           // readonly DrawingState
map.polygonGeometries      // readonly Geometry[]

// Bounding box
map.getBBox()
map.setBBox(coords)
map.clearBBox()

// Geocoding / search
map.autoComplete(searchTerm)
map.geocodeAndSelectBest(address)
map.geocodeById(id)
map.enhanceWithBoundaryPolygon(location)

// Search radius visualisation
map.updateSearchRadiusVisualization(center, radius)
map.removeSearchRadiusVisualization()
```

## Marker Structure

```ts
interface MapMarker {
  id: number
  lat: number
  lon: number
  title: string
  price: number
  propertyType: string
  classification: string
  address: { street: string; city: string; postcode: string }
  hasNote: boolean
  isFavorite: boolean
}
```

## Map Caching

Map instances are stored in a module-level cache keyed by a map ID string. `useInitMap()` returns an existing instance before creating a new one. This allows the same map to be reused across route changes without a full reinitialisation.

## Environment Variables

```bash
MAPTILER_API_KEY=...           # public — MapTiler map tiles and geocoding
MAPBOX_ACCESS_TOKEN=...        # public — Mapbox fallback
EASYPOSTCODES_KEY=...          # public — UK postcode lookup
```
