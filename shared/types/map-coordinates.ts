// Map marker interface for use with MapTiler maps
export interface MapMarker {
  id: string | number | null;
  lat: number;
  lon: number;
  title: string | null;
  bedrooms: number | null;
  price: number | null;
}
