import * as z from 'zod';

const traditionalSearchSchema = z.object({
  isSale: z.boolean().default(true),
  minBathrooms: z.number().min(0).default(0),
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
    'short-term-lets': z.boolean().default(false),
    'long-term-lets': z.boolean().default(false),
  }),
  saleIncludes: z.object({
    'sold-stc': z.boolean().default(false),
    'chain-free': z.boolean().default(false),
    'freehold-only': z.boolean().default(false),
  }),
  additionalFeatures: z.object({
    'disabled-access': z.boolean().default(false),
    'ev-charging': z.boolean().default(false),
    'full-fibre': z.boolean().default(false),
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
  minSize: z.preprocess(v => (v === '' || v == null) ? null : Number(v), z.number().min(0).nullable().optional()),
  maxSize: z.preprocess(v => (v === '' || v == null) ? null : Number(v), z.number().min(0).nullable().optional()),
  sizeUnit: z.enum(['sqmtr', 'sqft']).optional().default('sqmtr'),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readValidatedBody(event, traditionalSearchSchema.parse);

    const lat = body.location?.geometry?.coordinates?.[1];
    const lon = body.location?.geometry?.coordinates?.[0];
    const boundaryPolygon = body.location?.boundaryPolygon;
    const bbox = body.location?.bbox;

    let locationPropertyIds: number[] | null = null;

    if (lat && lon) {
      const { propertyIds } = await handleLocationFilter(lat, lon, body.radius, bbox, boundaryPolygon);
      locationPropertyIds = propertyIds;
    }

    const params: TraditionalSearchParams = {
      isSale: body.isSale,
      price: body.price,
      minBedrooms: body.minBedrooms,
      minBathrooms: body.minBathrooms,
      maxBathrooms: body.maxBathrooms,
      additionalFeatures: body.additionalFeatures,
      propertyTypes: body.propertyTypes,
      minSize: body.minSize,
      maxSize: body.maxSize,
      sizeUnit: body.sizeUnit,
      saleIncludes: body.saleIncludes,
      rentIncludes: body.rentIncludes,
    }

    const orderBy = buildListingOrderBy(body.sortBy);
    return fetchTraditionalSearchListings(params, locationPropertyIds, orderBy);

  } catch (error) {
    console.error('Traditional search error:', error);
    throw error;
  }
});