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

    // Try to get from cache first
    const cached = await useStorage().getItem(cacheKey);
    if (cached) {
      return cached;
    }

    // Use utility function to get PPD data
    const ppdData = await getPricePaidByAddress(postcode, street, city, number, flat);

    if (ppdData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No price paid data found for this address'
      });
    }

    // Sort sales by date (newest first)
    const sortedSales = ppdData
      .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());

    // Calculate market context using utility function
    const latestPrice = sortedSales.length > 0 && sortedSales[0] ? sortedSales[0].price : 0;
    const propertyType = sortedSales[0]?.property_type || null;
    
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
    await useStorage().setItem(cacheKey, result, {
      ttl: 60 * 60 * 24 * 30 // 30 days in seconds
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