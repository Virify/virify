import type { AddressParsed } from '~~/shared/types/address';
import { capataliseWords } from './strings/string-format';

export const parseAddress = (address: any, postcode: string): AddressParsed => {
  return {
    number: address.buildingNumber || null,
    flat: address.buildingName || null,
    name: address.buildingName || null,
    street: address.thoroughfareAndDescriptor || null,
    city: capataliseWords(address.postTown || address.city),
    locality: capataliseWords(address.dependentLocality),
    county: capataliseWords(address.county || address.province),
    district: null,
    country: capataliseWords(address.country) || 'United Kingdom',
    postcode: address.postCode || postcode,
    fullAddress: capataliseWords(address.envelopeAddress?.summaryLine) || null,
    lat: parseFloat(address.latitude) || null,
    lon: parseFloat(address.longitude) || null,
  };
};
