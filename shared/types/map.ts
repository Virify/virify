import type { Map as MaptilerMap, Marker } from "@maptiler/sdk";
import type { ListingTier } from "~~/layers/database/server/database/prisma/generated/client";
/**
 * Map marker type for use with MapTiler maps
 */
export type MapMarker = {
  id: string | number | null;
  lat: number;
  lon: number;
  title?: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  receptions: number | null;
  price: number | null;
  propertyType?: string | null;
  classification?: string | null;
  priceType?: string | null;
  address?: {
    street?: string;
    city?: string;
    postcode?: string;
  } | null;
  image?: any[]; // TODO: Define a proper image type
  hasNote?: boolean; // Optional - popup gets this independently
  isFavorite?: boolean; // Optional - popup gets this independently  
  tier: ListingTier; // Use string literals for tier
};

/**
 * Drawing mode type (simplified for our current needs)
 */
export type DrawingMode = "polygon" | null;

/**
 * Shape drawn event type
 */
export type ShapeDrawnEvent = {
  feature: GeoJSONFeature;
  type: Exclude<DrawingMode, null>;
};

/**
 * Extended Map type to include properties that are in the SDK but not in the type definitions
 */
export type ExtendedMapTilerMap = MaptilerMap & {
  dragPan: { enable(): void; disable(): void };
  scrollZoom: { enable(): void; disable(): void };
  doubleClickZoom: { enable(): void; disable(): void };
  touchZoomRotate: { enable(): void; disable(): void };
  keyboard: { enable(): void; disable(): void };
  boxZoom: { enable(): void; disable(): void };
  _controls?: any[];
  getSource(id: string): any;
  addSource(id: string, source: any): void;
  removeSource(id: string): void;
  addImage(id: string, options: Record<string, unknown>): void
  getLayer(id: string): any;
  addLayer(layer: any): void;
  removeLayer(id: string): void;
  getStyle(): { layers: Array<{ id: string; source: string }> };
  flyTo(options: { center?: [number, number]; zoom?: number; essential?: boolean; duration?: number }): void;
  jumpTo(options: { center?: [number, number]; zoom?: number; animate?: boolean }): void;
  getCanvas(): HTMLCanvasElement;
  queryRenderedFeatures(pointOrBox?: any, options?: any): any[];
  onReadyAsync(): Promise<unknown>;
  on(event: string, layer: string, listener: Function): void
  easeTo(options: { center: unknown, zoom: unknown, [key: string]: unknown }): void
};

/**
 * Map Instance used to track map state and markers
 */
export type MapInstance = {
  map: ExtendedMapTilerMap;
  markers: Marker[];
  markerMap: Map<string | number, Marker>;
  interactive: boolean;
  drawControl: any | null;
  featureMarkers: Map<string, Marker[]>; // Track markers by feature ID
};

/**
 * Map initialization options
 */
export type MapInitOptions = {
  interactive: boolean;
  zoom?: number;
  center: [number, number];
  navigationControl?: boolean;
  navigationControlOptions?: {
    position: string;
  };
};

/**
 * Geocoding feature returned from MapTiler API
 */
export type GeocodingFeature = {
  id: string;
  type: string;
  place_name: string;
  place_name_en: string;
  text: string;
  text_en?: string;
  display_name?: string;
  place_type?: string[];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    address?: string;
    place_type?: string[];
    [key: string]: any;
  };
  bbox?: [number, number, number, number];
  center?: [number, number];
  context?: Array<{
    id: string;
    text: string;
    text_en?: string;
  }>;
};

/**
 * Geocoding feature with boundary polygon for map visualization
 */
export type GeocodingFeatureWithBoundary = GeocodingFeature & {
  boundaryPolygon?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

/**
 * Geocoding response from MapTiler API
 */
export type GeocodingResponse = {
  type: string;
  features: GeocodingFeature[];
  attribution: string;
};

/**
 * Trending location type for tracking popular search locations
 */
export type TrendingLocation = {
  locationId: string;
  name: string;
  placeName: string;
  lat: number;
  lon: number;
  count: number;
}