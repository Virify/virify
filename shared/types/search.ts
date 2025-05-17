export type SearchParams = {
  location?: string | null;
  radius?: number | string | null;
  buyOrRent?: "buy" | "rent" | string | null;
  propertyTypes?: PropertyTypeWithOptions | null;
  priceRange?: number[] | null;
  bedrooms?: number[] | null;
  bathrooms?: number[] | null;
  addedToSite?: string | FormDataEntryValue | null;
  availabilityOptions?: string | FormDataEntryValue | null;
  featured?: any;
  coordinates?: { lat: number; lon: number } | null;
}
