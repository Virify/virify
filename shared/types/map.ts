import type { Map as MaptilerMap, Marker } from "@maptiler/sdk";

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
  hasNote?: boolean;
  isFavorite?: boolean;
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
  getLayer(id: string): any;
  addLayer(layer: any): void;
  removeLayer(id: string): void;
  getStyle(): { layers: Array<{ id: string; source: string }> };
  flyTo(options: { center?: [number, number]; zoom?: number; essential?: boolean; duration?: number }): void;
  getCanvas(): HTMLCanvasElement;
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
  place_name_en: string;
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
};

/**
 * Geocoding response from MapTiler API
 */
export type GeocodingResponse = {
  type: string;
  features: GeocodingFeature[];
  attribution: string;
};
