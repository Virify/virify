import * as z from 'zod';

const listingPpdSchema = z.object({
  listingId: z.number(),
  address: z.object({
    number: z.string().nullable().optional(),
    flat: z.string().nullable().optional(),
    street: z.string(),
    city: z.string(),
    postcode: z.string(),
    county: z.string().nullable().optional(),
  })
});

export default defineEventHandler(async (event) => {
  try {
    const { listingId, address } = await readValidatedBody(event, listingPpdSchema.parse);

    const { number, flat, street, city, postcode } = address;

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

    // Create cache key from listing ID
    const cacheKey = `ppd:listing:${listingId}`;
    console.log(`[CACHE] Checking price paid cache for key: ${cacheKey}`);

    // Try to get from cache first
    const startTime = Date.now();
    const cached = await useStorage("cache").getItem(cacheKey);
    if (cached) {
      const cacheTime = Date.now() - startTime;
      console.log(`[CACHE] PPD CACHE HIT - Retrieved in ${cacheTime}ms`);
      return cached;
    }

    console.log(`[CACHE] PPD CACHE MISS - Fetching from database`);
    
    // Use utility function to get PPD data
    const ppdData = await getPricePaidByAddress(postcode, street, city, number, flat);

    // Sort sales by date (newest first)
    const sortedSales = ppdData
      .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());

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

    // Cache the result for 30 days (PPD data is updated monthly)
    await useStorage("cache").setItem(cacheKey, result, {
      ttl: 60 * 60 * 24 * 30 // 30 days in seconds
    });

    const totalTime = Date.now() - startTime;
    console.log(`[CACHE] PPD CACHE MISS - Total time: ${totalTime}ms`);

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