import { prisma } from "./prisma-client";
import type { ListingCardType, ListingSearchOptional } from "~~/shared/types/listing";
import { getPriceFilter } from "./price";
import { Prisma } from "@prisma/client";

/**
 * Convert a GeoJSONFeature to a PostGIS compatible polygon string.
 * Takes coordinates from a GeoJSON Polygon and creates a WKT (Well-Known Text) representation
 * 
 * @param feature GeoJSON feature with polygon geometry
 * @returns WKT polygon string
 */
function convertGeoJSONToWKT(feature: GeoJSONFeature): string {
  if (feature.geometry.type !== 'Polygon') {
    throw new Error('Only Polygon geometries are supported');
  }

  // Get the first ring of coordinates (outer ring)
  const coordinates = feature.geometry.coordinates[0];
  
  // Create a polygon string from the coordinates
  const points = coordinates.map((coord: any[]) => `${coord[0]} ${coord[1]}`).join(',');
  
  // Return a WKT polygon string (SRID 4326 is standard WGS84 coordinates)
  return `POLYGON((${points}))`;
}

/**
 * Get listings within one or more polygon areas
 * 
 * @param type 'rent' or 'buy'
 * @param polygons Array of GeoJSON polygon features
 * @param optional Optional search parameters
 * @returns List of listings within the polygon(s)
 */
export async function getListingsByPolygon(
  type: 'rent' | 'buy',
  polygons: GeoJSONFeature[],
  optional: ListingSearchOptional
): Promise<ListingCardType[]> {
  // Extract optional parameters
  const { 
    propertyTypes, 
    priceRange, 
    bedrooms, 
    bathrooms, 
    addedToSite, 
    availabilityOptions, 
    featured, 
    take, 
    skip 
  } = optional;

  // Process the propertyTypes to create appropriate filters
  let propertyTypeFilter = {};
  let classificationFilter = {};

  if (propertyTypes && Object.keys(propertyTypes).length > 0) {
    // Collect all propertyTypeIds
    const propertyTypeIds = Object.keys(propertyTypes);
    if (propertyTypeIds.length > 0) {
      propertyTypeFilter = {
        type: {
          id: {
            in: propertyTypeIds.map(id => parseInt(id, 10))
          }
        }
      };
      
      // Collect all classification IDs per property type
      const allClassificationIds: number[] = [];
      Object.values(propertyTypes).forEach(classIds => {
        if (classIds && classIds.length > 0) {
          allClassificationIds.push(...classIds);
        }
      });
      
      if (allClassificationIds.length > 0) {
        classificationFilter = {
          classification: {
            id: {
              in: allClassificationIds
            }
          }
        };
      }
    }
  }

  // Set listing filter based on type (rent/buy)
  const listingFilter = type === "rent" ? "rentalListing" : "saleListing";

  // Create SQL conditions for each polygon
  const polygonConditions = polygons.map((polygon, index) => {
    const wkt = convertGeoJSONToWKT(polygon);
    return Prisma.sql`ST_Contains(
      ST_SetSRID(ST_GeomFromText(${wkt}), 4326),
      a.location
    )`;
  });

  // Join polygon conditions with OR
  const polygonCondition = Prisma.join(polygonConditions, ' OR ');

  // Find property IDs within the polygon(s)
  const propertiesInPolygon = await prisma.$queryRaw<{propertyId: number}[]>`
    SELECT p.id as "propertyId"
    FROM "Property" p
    JOIN "Address" a ON p."addressId" = a.id
    WHERE ${polygonCondition}
  `;

  // If no properties found in polygon, return empty array
  if (propertiesInPolygon.length === 0) {
    return [];
  }

  // Fetch listings for the found properties
  const listings = await prisma.listing.findMany({
    where: {
      [listingFilter]: {
        availabilityStatus: {
          in: availabilityOptions as any,
        },
      },
      price: getPriceFilter(priceRange),
      published: true,
      publishedAt: addedToSite
        ? {
            gte: new Date(addedToSite),
          }
        : undefined,
      property: {
        id: {
          in: propertiesInPolygon.map((p) => p.propertyId),
        },
        ...propertyTypeFilter,
        ...classificationFilter,
        numberBedrooms: bedrooms
          ? {
              gte: bedrooms[0], // min bedroom
              lte: bedrooms[1], // max bedroom
            }
          : undefined,
        numberBathrooms: bathrooms
          ? {
              gte: bathrooms[0], // min bathroom
              lte: bathrooms[1], // max bathroom
            }
          : undefined,
        ...featured,
      },
    },
    take,
    skip,
    select: listingCardFields,
  });

  return listings;
}
