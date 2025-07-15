import { prisma } from "./prisma-client";
import type { AddressLocation } from "~~/shared/types/location";
import { prepareFullTextSearch } from "./address";
import type { PropertySearchResult } from "~~/shared/types/property";
import { Prisma } from "@prisma/client";
/**
 * Convert meters to miles. For PostGIS, we need to convert meters to miles.
 *
 * @param miles Number
 * @returns Numer
 */
export const convertMilesToMeters = (miles: number): number => {
  return miles * 1609.34;
};

/**
 * Returns the location of a given addressId.
 * PostGIS always returns an array.
 *
 * @param addressId Number
 * @returns AddressLocation
 */
export async function getLocationByAddressId(addressId: number): Promise<AddressLocation> {
  const result = await prisma.$queryRaw<{ lat: number; lon: number }[]>(
    Prisma.sql`
      SELECT ST_Y(location) as lat, ST_X(location) as lon
      FROM "Address"
      WHERE id = ${addressId}
    `
  );

  if (!result[0]) throw createError({ statusCode: 404, statusMessage: "location not found" });

  return result[0];
}

/**
 * Creates a location from a given addressId and longitude and latitude.
 *
 * @param addressId Number
 * @param longitude Number
 * @param latitude Number
 * @returns
 */
export async function updateLocationByAddressId(addressId: number, long: number, lat: number) {
  return await prisma.$executeRaw(
    Prisma.sql`
      UPDATE "Address"
      SET location = ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)
      WHERE id = ${addressId}
    `
  );
}

/**
 * Update multiple locations in a batch.
 *
 * @param locations List of locations with id, lat, and lon
 * @returns
 */
export async function updateLocationsByAddressList(locations: { id: number; lat: number; lon: number }[]) {
  const queries = locations.map((loc) =>
    prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Address"
        SET location = ST_SetSRID(ST_MakePoint(${loc.lon}, ${loc.lat}), 4326)
        WHERE id = ${loc.id}
      `
    )
  );

  return await prisma.$transaction(queries);
}

/**
 * Get Nearby Properties by Latitude and Longitude with a distance threshold.
 *
 * @param lat Latitude of the location
 * @param lon Longitude of the location
 * @param distanceMeters Distance in meters for proximity filtering
 * @returns List of nearby propertyID's
 */
export async function getPropertyIdsByDistance(lat: number, lon: number, distanceMiles: number): Promise<PropertySearchResult> {
  const meters = convertMilesToMeters(distanceMiles);
  return await prisma.$queryRaw<PropertySearchResult>(
    Prisma.sql`
      SELECT p.id as "propertyId"
      FROM "Property" p
      JOIN "Address" a ON p."addressId" = a.id
      WHERE ST_DWithin(
        ST_Transform(a.location, 3857),
        ST_Transform(ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), 3857),
        ${meters}
      )
    `
  );
}

/**
 * Get property IDs strictly within one or more GeoJSON polygons.
 * Uses PostGIS ST_Within and ST_Union for efficient multi-polygon filtering.
 * @param geometries Array of GeoJSON Polygons (or single polygon)
 * @returns List of property IDs strictly within any of the polygons
 */
export async function getPropertyIdsByPolygons(geometries: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] }[]): Promise<PropertySearchResult> {
  if (!geometries || geometries.length === 0) return [];
  
  // Filter out invalid geometries and flatten MultiPolygons to individual Polygons
  const validGeometries: { type: "Polygon"; coordinates: number[][][] }[] = [];
  
  geometries.forEach(geometry => {
    if (!geometry || !geometry.coordinates?.length) return;
    
    if (geometry.type === "Polygon") {
      validGeometries.push(geometry as { type: "Polygon"; coordinates: number[][][] });
    } else if (geometry.type === "MultiPolygon") {
      // Convert MultiPolygon to individual Polygons
      const multiPolygonCoords = geometry.coordinates as number[][][][];
      multiPolygonCoords.forEach(polygonCoords => {
        validGeometries.push({
          type: "Polygon",
          coordinates: polygonCoords
        });
      });
    }
  });
  
  if (validGeometries.length === 0) return [];
  
  // Create ST_GeomFromGeoJSON calls for each polygon
  const polygonGeoms = validGeometries.map(geometry => {
    const geojson = JSON.stringify(geometry);
    return `ST_GeomFromGeoJSON('${geojson}')`;
  }).join(', ');
  
  // For single polygon, no need for ST_Union
  if (validGeometries.length === 1) {
    return await prisma.$queryRawUnsafe(`
      SELECT p.id as "propertyId"
      FROM "Property" p
      JOIN "Address" a ON p."addressId" = a.id
      WHERE ST_Within(a.location, ${polygonGeoms})
    `);
  }
  
  // For multiple polygons, use ST_Union
  return await prisma.$queryRawUnsafe(`
    SELECT p.id as "propertyId"
    FROM "Property" p
    JOIN "Address" a ON p."addressId" = a.id
    WHERE ST_Within(a.location, ST_Union(ARRAY[${polygonGeoms}]))
  `);
}

/**
 *
 * @param query string
 * @param distanceMeters number
 *
 * @returns propertyId
 */
export async function getNearbyPropertiesByTextQuery(query: string, distanceMiles: number): Promise<PropertySearchResult> {
  const meters = convertMilesToMeters(distanceMiles);
  const sanitizedQuery = prepareFullTextSearch(query);

  return await prisma.$queryRaw<PropertySearchResult>`
  -- Find the most relevant address based on the full-text search query
  WITH matched_address AS (
    SELECT id, location
    FROM "Address"
    WHERE to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, ''))
          @@ to_tsquery('english', ${sanitizedQuery})
    ORDER BY ts_rank(
      to_tsvector('english', COALESCE(street, '') || ' ' || COALESCE(city, '') || ' ' || COALESCE(postcode, '')),
      to_tsquery('english', ${sanitizedQuery})
    ) DESC
    LIMIT 1
  )

-- Select property IDs and distance from the matched address
  SELECT p.id as "propertyId", 
    ST_Distance(
      ST_Transform(a.location, 3857), 
      ST_Transform(ma.location, 3857)
    ) / 1609.34 AS "distanceMiles"  -- distance in miles
  FROM "Property" p

  -- Join each property to its address (to get its coordinates)
  JOIN "Address" a ON p."addressId" = a.id

  -- Join to the matched address from the CTE (cross join, since it's a single row)
  JOIN matched_address ma ON TRUE

  -- Spatial filter: only include addresses within the distance threshold
  WHERE ST_DWithin(
    ST_Transform(a.location, 3857),
    ST_Transform(ma.location, 3857),
    ${meters}
  )
`;
}

/**
 * Converts a bounding box to a GeoJSON polygon
 */
export function bboxToPolygon(bbox: [number, number, number, number]) {
  const [west, south, east, north] = bbox;
  return {
    type: "Polygon" as const,
    coordinates: [[
      [west, south],
      [east, south], 
      [east, north],
      [west, north],
      [west, south]
    ]]
  };
}

/**
 * Handles location filtering by fetching property IDs within a given radius, bbox, or boundary polygon.
 */
export async function handleLocationFilter(lat?: number, lon?: number, radius?: number, bbox?: [number, number, number, number], boundaryPolygon?: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] }) {
  if (!lat || !lon) {
    return { propertyIds: null, locationContext: "" };
  }

  // For location-only searches (radius = 0), use boundary polygon or bbox
  if (radius === 0) {
    if (boundaryPolygon) {
      try {
        const nearbyProperties = await getPropertyIdsByPolygons([boundaryPolygon]);
        const propertyIds = nearbyProperties.map((p) => p.propertyId);
        return { propertyIds, locationContext: "within administrative boundary" };
      } catch (error) {
        console.error('Boundary polygon search failed:', error);
      }
    }
    
    if (bbox) {
      try {
        const polygon = bboxToPolygon(bbox);
        const nearbyProperties = await getPropertyIdsByPolygons([polygon]);
        const propertyIds = nearbyProperties.map((p) => p.propertyId);
        return { propertyIds, locationContext: "within selected area" };
      } catch (error) {
        console.error('Bbox search failed:', error);
      }
    }
    
    // No boundary data available for location-only search
    return { propertyIds: [], locationContext: "no boundary data available" };
  }

  // Regular radius search
  const nearbyProperties = await getPropertyIdsByDistance(lat, lon, radius!);
  const propertyIds = nearbyProperties.map((p) => p.propertyId);
  const locationContext = `within ${radius} miles of ${lat}, ${lon}`;
  return { propertyIds, locationContext };
}
