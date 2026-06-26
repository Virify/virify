import * as z from 'zod';

const listingPpdSchema = z.object({
  listingId: z.number(),
  address: z.object({
    number: z.string().nullable().optional(),
    flat: z.string().nullable().optional(),
    fullAddress: z.string().nullable().optional(),
    street: z.string(),
    city: z.string(),
    postcode: z.string(),
    county: z.string().nullable().optional(),
  })
});

export default defineEventHandler(async (event) => {
  try {
    const { listingId, address } = await readValidatedBody(event, listingPpdSchema.parse);

    const { street, city, postcode } = address;
    const { number, flat } = resolvePricePaidAddressParts(address);

    if (!postcode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Postcode is required'
      });
    }

    if (!number) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Property number is required for PPD matching'
      });
    }

    // Cache bucket resets on the 2nd of each month — aligned with the Railway PPD DB import.
    // Before the 2nd, uses the previous month's bucket so stale cache isn't served post-import.
    const now = new Date();
    const day = now.getUTCDate();
    const bucketMonth = day < 2
      ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
      : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const bucket = `${bucketMonth.getUTCFullYear()}-${String(bucketMonth.getUTCMonth() + 1).padStart(2, '0')}`;

    // Create cache key from listing ID + monthly bucket
    const cacheKey = `ppd:listing:v5:${listingId}:${bucket}`;

    // Try to get from cache first
    const startTime = Date.now();
    const cached = await useStorage("cache").getItem(cacheKey);
    if (cached) {
      return cached;
    }

    // Use utility function to get PPD data
    const ppdData = await getPricePaidByAddress(postcode, street, city, number, flat);

    // Sort sales by date (newest first)
    const sortedSales = ppdData
      .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());

    if (sortedSales.length === 0 && flat) {
      await logPricePaidFlatMissDiagnostics({
        listingId,
        address,
        resolvedAddress: { number, flat, street, city, postcode },
      });
    }

    // Calculate market context using utility function
    let latestPrice = sortedSales.length > 0 && sortedSales[0] ? sortedSales[0].price : 0;
    let propertyType = sortedSales[0]?.property_type || null;

    // If no sales, try to get data from listing or draft listing
    if (sortedSales.length === 0) {
      // Try live listing first
      let listing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { property: { include: { type: true } } }
      });
      
      // If not found, try draft listing
      if (!listing) {
        const draftListing = await prisma.draftListing.findUnique({
          where: { id: listingId },
          include: { property: { include: { type: true } } }
        });
        if (draftListing) {
          listing = draftListing as any; // Use same structure
        }
      }
      
      if (listing) {
        latestPrice = listing.price;
        // Map property type
        const typeName = listing.property?.type?.name;
        if (typeName) {
          if (typeName.includes('Detached') && !typeName.includes('Semi')) propertyType = 'D';
          else if (typeName.includes('Semi')) propertyType = 'S';
          else if (typeName.includes('Terraced')) propertyType = 'T';
          else if (typeName.includes('Flat') || typeName.includes('Apartment') || typeName.includes('Maisonette')) propertyType = 'F';
          else propertyType = 'O';
        }
      }
    }
    
    const marketContext = await calculateMarketContext(
      city, 
      postcode, 
      number, 
      flat, 
      propertyType, 
      latestPrice, 
      sortedSales
    );

    // Process sales data using utility function
    const propertySales = processPricePaidSales(sortedSales);

    const result = {
      data: {
        sales: propertySales,
        total_sales: propertySales.length,
        latest_sale: propertySales[0],
        price_range: propertySales.length > 0 ? {
          min: Math.min(...propertySales.map(s => s.price)),
          max: Math.max(...propertySales.map(s => s.price))
        } : null,
        market_context: marketContext
      }
    };

    // Cache the result (TTL: 35 days — longer than the monthly bucket cycle so old keys expire naturally)
    await useStorage("cache").setItem(cacheKey, result, {
      ttl: 60 * 60 * 24 * 35
    });

    return result;

  } catch (error) {
    // Handle database/unexpected errors
    console.error('Error fetching price paid data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch price paid data'
    });
  }
});

async function logPricePaidFlatMissDiagnostics(input: {
  listingId: number;
  address: z.infer<typeof listingPpdSchema>["address"];
  resolvedAddress: {
    number: string;
    flat: string;
    street: string;
    city: string;
    postcode: string;
  };
}) {
  try {
    const { postcode, street, city, number, flat } = input.resolvedAddress;
    const nearby = await getPricePaidFlatMissDiagnostics(postcode, street, city, number, flat);

    console.warn("[price-paid] flat exact match missed", {
      listingId: input.listingId,
      submittedAddress: input.address,
      resolvedAddress: input.resolvedAddress,
      nearbyCount: nearby.length,
      nearby: nearby.map((row) => ({
        paon: row.paon,
        saon: row.saon,
        price: row.price,
        transfer_date: row.transfer_date.toISOString(),
        property_type: row.property_type,
      })),
    });
  } catch (error) {
    console.warn("[price-paid] flat miss diagnostics failed", {
      listingId: input.listingId,
      error,
    });
  }
}
