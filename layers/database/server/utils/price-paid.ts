/**
 * Fetch PPD sale rows for a resolved address using exact PAON/SAON matches.
 */
export async function findPricePaidSalesByAddress(input: {
  postcode: string;
  street: string;
  city: string;
  addressMatches: PricePaidAddressMatch[];
}): Promise<PricePaidSale[]> {
  return ppdPrisma.pricePaid.findMany({
    where: {
      postcode: input.postcode,
      street: input.street,
      town_city: input.city,
      OR: input.addressMatches,
    },
    orderBy: {
      transfer_date: "desc",
    },
  });
}

/**
 * Fetch all PPD sale rows for a postcode, optionally narrowed to a street.
 */
export async function findPricePaidSalesByPostcodeAndStreet(input: {
  postcode: string;
  street?: string | null;
}): Promise<PricePaidSale[]> {
  return ppdPrisma.pricePaid.findMany({
    where: {
      postcode: input.postcode,
      ...(input.street ? { street: input.street } : {}),
    },
    orderBy: { transfer_date: "desc" },
  });
}

/**
 * Fetch aggregate PPD stats needed to build listing market context.
 */
export async function getPricePaidMarketStats(input: {
  city: string;
  propertyType: string | null;
  subject: PricePaidSubject;
  referenceYear: PricePaidYearRange;
  previousYear: PricePaidYearRange;
}) {
  const subjectFilter = {
    postcode: input.subject.postcode,
    paon: input.subject.paon,
    ...(input.subject.saon ? { saon: input.subject.saon } : {}),
  };

  const [areaStats, propertyTypeStats, allAreaPrices, previousYearStats] = await Promise.all([
    ppdPrisma.pricePaid.aggregate({
      where: {
        town_city: input.city,
        transfer_date: {
          gte: input.referenceYear.start,
          lte: input.referenceYear.end,
        },
        NOT: subjectFilter,
      },
      _avg: { price: true },
      _count: { price: true },
    }),
    ppdPrisma.pricePaid.aggregate({
      where: {
        town_city: input.city,
        property_type: input.propertyType,
        transfer_date: {
          gte: input.referenceYear.start,
          lte: input.referenceYear.end,
        },
        NOT: subjectFilter,
      },
      _avg: { price: true },
      _count: { price: true },
    }),
    ppdPrisma.pricePaid.findMany({
      where: {
        town_city: input.city,
        transfer_date: {
          gte: input.referenceYear.start,
          lte: input.referenceYear.end,
        },
      },
      select: { price: true },
      orderBy: { price: "asc" },
    }),
    ppdPrisma.pricePaid.aggregate({
      where: {
        town_city: input.city,
        transfer_date: {
          gte: input.previousYear.start,
          lte: input.previousYear.end,
        },
      },
      _avg: { price: true },
    }),
  ]);

  return {
    areaStats,
    propertyTypeStats,
    allAreaPrices,
    previousYearStats,
  };
}
