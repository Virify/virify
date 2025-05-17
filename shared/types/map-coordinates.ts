// Map marker interface for use with MapTiler maps
export interface MapMarker {
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
  image?: any[];
  hasNote?: boolean;
  isFavorite?: boolean;
}
