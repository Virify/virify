import * as z from 'zod';
import type { Prisma } from '~~/layers/database/server/database/prisma/generated/client';

const traditionalSearchSchema = z.object({
  isSale: z.boolean().default(true),
  maxBathrooms: z.number().min(0).default(6),
  minBedrooms: z.number().min(0).default(0),
  maxBeds: z.number().min(0).default(9),
  minBeds: z.number().min(0).default(0),
  maxPrice: z.number().min(0),
  minPrice: z.number().min(0),
  price: z.tuple([z.number().min(0), z.number().min(0)]),
  location: z.object({
    geometry: z.object({
      coordinates: z.tuple([z.number(), z.number()])
    }).optional(),
    boundaryPolygon: z.object({
      type: z.enum(['Polygon', 'MultiPolygon']),
      coordinates: z.union([
        z.array(z.array(z.array(z.number()))),
        z.array(z.array(z.array(z.array(z.number()))))
      ])
    }).optional(),
    bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional()
  }).passthrough().optional(),
  radius: z.number().min(0).max(40).optional(),
  boundaryPolygon: z
    .object({
      type: z.enum(['Polygon', 'MultiPolygon']),
      coordinates: z.union([
        z.array(z.array(z.array(z.number()))), // Polygon
        z.array(z.array(z.array(z.array(z.number())))), // MultiPolygon
      ]),
    })
    .optional(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  rentIncludes: z.object({
    'let-agreed': z.boolean().default(false),
    'bills-included': z.boolean().default(false),
    furnished: z.boolean().default(false),
  }),
  saleIncludes: z.object({
    'cash-only': z.boolean().default(false),
    'retirement': z.boolean().default(false),
    'shared-ownership': z.boolean().default(false),
    'sold-stc': z.boolean().default(false),
  }),
  additionalFeatures: z.object({
    'disabled-access': z.boolean().default(false),
    garage: z.boolean().default(false),
    garden: z.boolean().default(false),
    'off-street-parking': z.boolean().default(false),
    'pets': z.boolean().default(false),
  }),
  propertyTypes: z.object({
    House: z.array(z.enum(['Terraced', 'Detached', 'Semi-detached', 'End of Terrace', 'Mansion'])).default([]),
    Cottage: z.array(z.enum(['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'])).default([]),
    Bungalow: z.array(z.enum(['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'])).default([]),
    Flat: z.array(z.enum(['Converted', 'Studio', 'Maisonette', 'High-rise', 'Within a Complex', 'Penthouse'])).default([]),
    Land: z.array(z.enum(['Residential', 'Commercial', 'Agricultural', 'Development Plot', 'Development Potential'])).default([]),
    Farms: z.array(z.enum(['Non-working', 'Working', 'Small Holding'])).default([]),
    Specialty: z.array(z.enum(['Retirement Home', 'New Build Home'])).default([]),
    'Student Accommodation': z.array(z.enum(['Flat', 'House', 'House-share'])).default([]),
  }).optional(),
  sortBy: z.enum(['relevance', 'price-asc', 'price-desc', 'date-desc', 'date-asc']).optional().default('relevance'),
  minSize: z.number().min(0).nullable().optional(),
  maxSize: z.number().min(0).nullable().optional(),
  sizeUnit: z.enum(['sqmtr', 'sqft']).optional().default('sqmtr'),
});

function buildOrderBy(sortBy: string): import('~~/layers/database/server/database/prisma/generated/client').Prisma.ListingOrderByWithRelationInput | undefined {
  switch (sortBy) {
    case 'price-asc': return { price: 'asc' }
    case 'price-desc': return { price: 'desc' }
    case 'date-desc': return { publishedAt: 'desc' }
    case 'date-asc': return { publishedAt: 'asc' }
    default: return undefined
  }
}

export default defineEventHandler(async (event) => {
  
  try {
    const body = await readValidatedBody(event, traditionalSearchSchema.parse);

    // Extract location data from the full location object
    const lat = body.location?.geometry?.coordinates?.[1];
    const lon = body.location?.geometry?.coordinates?.[0];
    const boundaryPolygon = body.location?.boundaryPolygon;
    const bbox = body.location?.bbox;

    // Handle location filtering first to get property IDs
    let locationPropertyIds: number[] | null = null;
    let locationContext: any = null;
    
    if (lat && lon) {
      const locationResult = await handleLocationFilter(
        lat,
        lon,
        body.radius,
        bbox,
        boundaryPolygon
      );
      locationPropertyIds = locationResult.propertyIds;
      locationContext = locationResult.locationContext;
    }

    // Build the where clause
    const whereClause: Prisma.ListingWhereInput = {
      published: true,
      archived: false,
    };

    // Listing type (sale or rent)
    if (body.isSale) {
      whereClause.saleListing = { isNot: null };
    } else {
      whereClause.rentalListing = { isNot: null };
    }

    // Price range
    if (body.price && body.price.length === 2) {
      whereClause.price = {
        gte: body.price[0],
        lte: body.price[1],
      };
    }

    // Property filters (nested in property relation)
    const propertyFilters: Prisma.PropertyWhereInput = {};

    // Location filter - restrict to property IDs within location
    if (locationPropertyIds !== null) {
      propertyFilters.id = { in: locationPropertyIds };
    }

    // Bedrooms
    if (body.minBedrooms > 0) {
      propertyFilters.numberBedrooms = {
        gte: body.minBedrooms,
      };
    }

    // Bathrooms
    if (body.maxBathrooms > 0) {
      propertyFilters.numberBathrooms = {
        lte: body.maxBathrooms,
      };
    }

    // Property types and classifications
    // Only apply filter if propertyTypes exists and has at least one type with subtypes selected
    if (body.propertyTypes) {
      const typeClassificationConditions: Prisma.PropertyWhereInput[] = [];

      for (const [typeName, subtypes] of Object.entries(body.propertyTypes)) {
        if (subtypes.length > 0) {
          // Each type can have multiple subtypes selected
          typeClassificationConditions.push({
            type: { name: typeName },
            classification: {
              name: { in: subtypes }
            }
          });
        }
      }

      // Only apply the filter if we have at least one condition
      // If no conditions (all arrays empty), don't filter by type - return all properties
      if (typeClassificationConditions.length > 0) {
        propertyFilters.OR = typeClassificationConditions;
      }
    }

    // Additional features
    if (body.additionalFeatures.garden) {
      propertyFilters.outdoorSpace = {
        is: {
          garden: { some: {} }
        }
      };
    }

    if (body.additionalFeatures.garage || body.additionalFeatures['off-street-parking']) {
      propertyFilters.parking = { isNot: null };
    }

    if (body.additionalFeatures.pets) {
      propertyFilters.additionalFeatures = {
        is: { petFriendly: true }
      };
    }

    if (body.additionalFeatures['disabled-access']) {
    console.log('Final WHERE clause:', JSON.stringify(whereClause, null, 2));

      propertyFilters.accessibilityFeatures = { isNot: null };
    }

    // Apply property size filter (DB stores size in sqmtr; convert if user selected sqft)
    const SQFT_TO_SQMTR = 0.092903
    const minSizeSqmtr = body.minSize != null
      ? (body.sizeUnit === 'sqft' ? body.minSize * SQFT_TO_SQMTR : body.minSize)
      : undefined
    const maxSizeSqmtr = body.maxSize != null
      ? (body.sizeUnit === 'sqft' ? body.maxSize * SQFT_TO_SQMTR : body.maxSize)
      : undefined
    if (minSizeSqmtr !== undefined || maxSizeSqmtr !== undefined) {
      propertyFilters.size = {
        ...(minSizeSqmtr !== undefined ? { gte: minSizeSqmtr } : {}),
        ...(maxSizeSqmtr !== undefined ? { lte: maxSizeSqmtr } : {}),
      }
    }

    // Apply property filters if any exist
    if (Object.keys(propertyFilters).length > 0) {
      whereClause.property = { is: propertyFilters };
    }

    // Fetch lean card data for listings
    const orderBy = buildOrderBy(body.sortBy)
    const listings = await fetchListingsForCard(whereClause, orderBy);

    return listings;

  } catch (error) {
    console.error('Traditional search error:', error);
    throw error;
  }
});