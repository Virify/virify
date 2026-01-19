import type { AddressParsed } from '~~/shared/types/address';

export const parseAddress = (address: any, postcode: string): AddressParsed => {
  return {
    number: address.building_number || address.sub_building_number || null,
    flat: address.sub_building_number || null,
    name: address.building_name || address.sub_building_name || null,
    street: address.thoroughfare || address.street || null,
    city: address.town_or_city || address.city || null,
    locality: address.locality || address.village || address.district || null,
    county: address.county || address.province || null,
    district: address.district || null,
    country: address.country || 'United Kingdom',
    postcode: address.postcode || postcode,
    fullAddress: address.formatted_address ? address.formatted_address.filter((part: string) => part && part.trim()).join(', ') : null,
    lat: address.latitude || null,
    lon: address.longitude || null,
  };
};
