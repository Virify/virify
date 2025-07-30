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

    // Build exact match conditions since addresses are from PPD data
    const whereConditions: any = {
      postcode: postcode.toUpperCase(),
      street: street.toUpperCase(),
      town_city: city.toUpperCase(),
      paon: number.toUpperCase()
    };

    // Add exact flat matching if available
    if (flat) {
      whereConditions.saon = flat.toUpperCase();
    }

    const ppdData = await ppdPrisma.pricePaid.findMany({
      where: whereConditions,
      orderBy: {
        transfer_date: 'desc'
      }
    });

    if (ppdData.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No price paid data found for this address'
      });
    }

    // Sort sales by date (newest first) and calculate percentage changes
    const sortedSales = ppdData
      .sort((a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime());

    const propertySales = sortedSales.map((item, index) => {
      let percentageChange: number | null = null;
      
      // Calculate percentage change from previous sale (if exists)
      if (index < sortedSales.length - 1) {
        const previousSale = sortedSales[index + 1];
        if (previousSale && previousSale.price) {
          const priceDiff = item.price - previousSale.price;
          percentageChange = Math.round((priceDiff / previousSale.price) * 100 * 100) / 100; // Round to 2 decimal places
        }
      }

      return {
        price: item.price,
        transfer_date: item.transfer_date,
        transaction_id: item.transaction_id,
        old_new: item.old_new,
        duration: item.duration,
        property_type: item.property_type,
        percentage_change: percentageChange
      };
    });

    const result = {
      data: {
        sales: propertySales,
        total_sales: propertySales.length,
        latest_sale: propertySales[0],
        price_range: propertySales.length > 0 ? {
          min: Math.min(...propertySales.map(s => s.price)),
          max: Math.max(...propertySales.map(s => s.price))
        } : null
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