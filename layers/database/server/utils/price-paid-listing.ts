/**
 * Build the listing-level price-paid response for a validated listing address.
 */
export async function getPricePaidListingResponse(input: {
  listingId: number;
  address: PricePaidListingAddress;
}): Promise<PricePaidResponse> {
  const { listingId, address } = input;
  const { street, city, postcode } = address;
  const { number, flat } = resolvePricePaidAddressParts(address);

  if (!postcode) {
    throw createError({
      statusCode: 400,
      statusMessage: "Postcode is required",
    });
  }

  if (!number) {
    throw createError({
      statusCode: 400,
      statusMessage: "Property number is required for PPD matching",
    });
  }

  const cacheKey = createPricePaidListingCacheKey(listingId);
  const cached = await useStorage("cache").getItem<PricePaidResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const resolvedAddress: PricePaidResolvedAddress = {
    postcode: formatPricePaidAddressPart(postcode),
    street: formatPricePaidAddressPart(street),
    city: formatPricePaidAddressPart(city),
    number: formatPricePaidAddressPart(number),
    flat,
  };

  const ppdData = await findPricePaidSalesByAddress({
    postcode: resolvedAddress.postcode,
    street: resolvedAddress.street,
    city: resolvedAddress.city,
    addressMatches: buildPricePaidAddressMatches(resolvedAddress.number, flat),
  });

  const sortedSales = ppdData.sort(
    (a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime(),
  );

  if (sortedSales.length === 0) {
    const result: PricePaidResponse = { data: null };
    await useStorage("cache").setItem(cacheKey, result, {
      ttl: 60 * 60 * 24 * 35,
    });
    return result;
  }

  const latestPrice = sortedSales[0]?.price ?? 0;
  const propertyType = sortedSales[0]?.property_type || null;
  const referenceYear = getPricePaidReferenceYear(sortedSales);
  const marketStats = await getPricePaidMarketStats({
    city: resolvedAddress.city,
    propertyType,
    subject: {
      postcode: resolvedAddress.postcode,
      paon: resolvedAddress.number,
      saon: resolvedAddress.flat,
    },
    referenceYear: createPricePaidYearRange(referenceYear),
    previousYear: createPricePaidYearRange(referenceYear - 1),
  });
  const marketContext = createMarketContext({
    referenceYear,
    latestPrice,
    stats: marketStats,
  });
  const propertySales = processPricePaidSales(sortedSales);

  const result: PricePaidResponse = {
    data: {
      sales: propertySales,
      total_sales: propertySales.length,
      latest_sale: propertySales[0],
      price_range:
        propertySales.length > 0 ?
          {
            min: Math.min(...propertySales.map((sale) => sale.price)),
            max: Math.max(...propertySales.map((sale) => sale.price)),
          }
        : null,
      market_context: marketContext,
    },
  };

  await useStorage("cache").setItem(cacheKey, result, {
    ttl: 60 * 60 * 24 * 35,
  });

  return result;
}

/**
 * Create the monthly cache key aligned with the PPD import cycle.
 */
function createPricePaidListingCacheKey(listingId: number): string {
  const now = new Date();
  const day = now.getUTCDate();
  const bucketMonth =
    day < 2 ?
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const bucket = `${bucketMonth.getUTCFullYear()}-${String(bucketMonth.getUTCMonth() + 1).padStart(2, "0")}`;

  return `ppd:listing:v5:${listingId}:${bucket}`;
}
