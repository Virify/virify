import type { GeocodingFeature, GeocodingFeatureWithBoundary } from "./map";

export type UserSavedLocation = {
  id: number;
  location: string;
  geocodingFeature: GeocodingFeature | GeocodingFeatureWithBoundary;
  lat: number;
  lon: number;
  name: string;
  bbox?: [number, number, number, number];
  createdAt: string | Date;
  updatedAt?: string | Date;
};