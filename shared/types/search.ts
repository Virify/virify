export type SearchParams = {
  location?: string | null;
  radius?: number | string | null;
  buyOrRent?: "buy" | "rent" | string | null;
  propertyTypes?: string[] | null;
  propertyTypeIds?: number[] | null;
  propertyClassifications?: {
    id: number;
    name: string;
    propertyTypeId: number;
    propertyTypeName: string;
    selected: boolean;
  }[] | null;
  priceRange?: number[] | null;
  bedrooms?: number[] | null;
  bathrooms?: number[] | null;
  addedToSite?: string | FormDataEntryValue | null;
  availabilityOptions?: string | FormDataEntryValue | null;
  featured?: any;
}
