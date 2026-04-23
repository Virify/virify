// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import type {
  Prisma,
  Listing,
} from "../../../database/server/database/prisma/generated/client";
import {
  RentalPriceType,
  FurnishedStatus,
  RentalAvailabilityStatus,
  TenureType,
  SalePriceType,
  SaleAvailabilityStatus,
  ListingTier,
} from "../../../database/server/database/prisma/generated/enums";
import { prisma } from "../../../database/server/utils/prisma-client";
/**
 * Generate a random date between 1, 3, 7, and 14 days ago.
 */
export const generateRandomDate = () => {
  const daysOptions = [1, 3, 7, 14];
  const randomDays =
    daysOptions[Math.floor(Math.random() * daysOptions.length)];
  return faker.date.recent({ days: randomDays });
};

/**
 * Generate a random RentalListing object
 *
 * @returns RentalListing
 */
export const generateRentalObject =
  (): Prisma.RentalListingCreateWithoutListingInput => {
    return {
      deposit: Math.round(faker.number.float({ min: 1000, max: 10000 })),
      holdingDeposit: Math.round(faker.number.float({ min: 1000, max: 10000 })),
      rentFrequency: faker.helpers.arrayElement(Object.values(RentalPriceType)),
      isBillsIncluded: faker.datatype.boolean(),
      rentalLength: faker.helpers.arrayElement(["SHORT_TERM", "LONG_TERM"]),
      furnishedStatus: faker.helpers.arrayElement(
        Object.values(FurnishedStatus),
      ),
      availabilityStatus: faker.helpers.arrayElement(
        Object.values(RentalAvailabilityStatus),
      ),
    };
  };

/**
 * Generate a random SaleListing object
 *
 * @returns SaleListing
 */
export const generateSaleObject =
  (): Prisma.SaleListingCreateWithoutListingInput => {
    return {
      tenureType: faker.helpers.arrayElement(Object.values(TenureType)),
      chain: faker.datatype.boolean(),
      sharedOwnership: faker.datatype.boolean(),
      priceType: faker.helpers.arrayElement(Object.values(SalePriceType)),
      availabilityStatus: faker.helpers.arrayElement(
        Object.values(SaleAvailabilityStatus),
      ),
    };
  };

/**
 * Generate a weighted listing tier
 * 60% BASIC, 30% FEATURED, 10% PREMIUM
 *
 * @returns ListingTier
 */
const generateWeightedListingTier = (): ListingTier => {
  const random = Math.random() * 100;

  if (random < 60) {
    return ListingTier.BASIC;
  } else if (random < 90) {
    return ListingTier.FEATURED;
  } else {
    return ListingTier.PREMIUM;
  }
};

const generateRandomViews = () => {
  return faker.number.int({ min: 0, max: 30 });
};

// Common user agents for realistic seed data
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
];

// Common referrer sources
const referrers = [
  "https://www.google.com/",
  "https://www.google.co.uk/",
  "https://www.facebook.com/",
  "https://twitter.com/",
  null, // Direct traffic
  null,
  null,
];

// Traffic sources for analytics
const viewSources = [
  "search",
  "direct",
  "social",
  "email",
  "referral",
] as const;

/**
 * Generate random listing views for a listing with enhanced analytics fields
 *
 * @param listingId ID of the listing to create views for
 * @returns Promise resolving to the number of views created
 */
export const generateListingViews = async (
  listingId: number,
): Promise<number> => {
  const viewCount = generateRandomViews();
  const views = [];

  // Generate views spread out over the past 30 days
  for (let i = 0; i < viewCount; i++) {
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const viewDate = new Date();
    viewDate.setDate(viewDate.getDate() - daysAgo);

    views.push({
      listingId,
      sessionId: faker.string.uuid(),
      userAgent: faker.helpers.arrayElement(userAgents),
      referrer: faker.helpers.arrayElement(referrers),
      source: faker.helpers.arrayElement(viewSources),
      duration: faker.number.int({ min: 5, max: 300 }), // 5 seconds to 5 minutes
      createdAt: viewDate,
    });
  }

  // Create the views in batches for better performance
  const batchSize = 100;
  for (let i = 0; i < views.length; i += batchSize) {
    const batch = views.slice(i, i + batchSize);
    await prisma.listingView.createMany({
      data: batch,
    });
  }

  return viewCount;
};

/**
 * Generate listing impressions (search result appearances) for a listing
 *
 * @param listingId ID of the listing
 * @returns Promise resolving to the number of impressions created
 */
export const generateListingImpressions = async (
  listingId: number,
): Promise<number> => {
  const impressionCount = faker.number.int({ min: 10, max: 100 }); // More impressions than views
  const impressions = [];

  // Generate impressions spread out over the past 30 days
  for (let i = 0; i < impressionCount; i++) {
    const daysAgo = faker.number.int({ min: 0, max: 30 });
    const impressionDate = new Date();
    impressionDate.setDate(impressionDate.getDate() - daysAgo);

    // Some impressions lead to clicks (views), most don't
    const clicked = Math.random() < 0.15; // ~15% CTR
    const position = faker.number.int({ min: 1, max: 20 }); // Position in search results

    impressions.push({
      listingId,
      sessionId: faker.string.uuid(),
      position,
      clicked,
      createdAt: impressionDate,
    });
  }

  // Create in batches
  const batchSize = 100;
  for (let i = 0; i < impressions.length; i += batchSize) {
    const batch = impressions.slice(i, i + batchSize);
    await prisma.listingImpression.createMany({
      data: batch,
    });
  }

  return impressionCount;
};

/**
 * Generate daily listing stats (pre-aggregated) for a listing
 *
 * @param listingId ID of the listing
 * @param userId ID of the listing owner
 * @returns Promise resolving to the number of daily stat records created
 */
export const generateDailyListingStats = async (
  listingId: number,
  userId: number,
): Promise<number> => {
  const stats = [];

  // Generate stats for the past 7 days
  for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Normalize to midnight

    const views = faker.number.int({ min: 0, max: 20 });
    const impressions = faker.number.int({ min: views * 3, max: views * 10 }); // More impressions than views
    const uniqueViews = Math.floor(views * 0.7); // ~70% unique
    const favourites =
      Math.random() < 0.3 ? faker.number.int({ min: 0, max: 3 }) : 0; // Some days get favourites
    const enquiries =
      Math.random() < 0.1 ? faker.number.int({ min: 0, max: 2 }) : 0; // Rare enquiries
    const avgDuration = faker.number.int({ min: 30, max: 180 }); // 30s to 3min average

    stats.push({
      listingId,
      userId,
      date,
      views,
      uniqueViews,
      impressions,
      clicks: Math.floor(impressions * 0.15), // ~15% CTR
      favourites,
      enquiries,
      avgDuration,
    });
  }

  // Create in batches
  const batchSize = 30;
  for (let i = 0; i < stats.length; i += batchSize) {
    const batch = stats.slice(i, i + batchSize);
    await prisma.dailyListingStats.createMany({
      data: batch,
      skipDuplicates: true, // Prevent duplicate date conflicts
    });
  }

  return stats.length;
};

/**
 * Generate daily user stats (pre-aggregated) for a user
 *
 * @param userId ID of the user
 * @returns Promise resolving to the number of daily stat records created
 */
export const generateDailyUserStats = async (
  userId: number,
): Promise<number> => {
  const stats = [];

  // Generate stats for the past 7 days
  for (let daysAgo = 0; daysAgo < 7; daysAgo++) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Normalize to midnight

    const listingViews = faker.number.int({ min: 0, max: 100 });
    const totalImpressions = faker.number.int({
      min: listingViews * 3,
      max: listingViews * 10,
    });
    const enquiriesReceived =
      Math.random() < 0.2 ? faker.number.int({ min: 0, max: 5 }) : 0;
    const enquiriesSent =
      Math.random() < 0.15 ? faker.number.int({ min: 0, max: 3 }) : 0;
    const favouritesReceived =
      Math.random() < 0.3 ? faker.number.int({ min: 0, max: 5 }) : 0;
    const searchesPerformed = faker.number.int({ min: 0, max: 10 });

    stats.push({
      userId,
      date,
      listingViews,
      totalImpressions,
      enquiriesReceived,
      enquiriesSent,
      favouritesReceived,
      searchesPerformed,
    });
  }

  // Create in batches
  const batchSize = 30;
  for (let i = 0; i < stats.length; i += batchSize) {
    const batch = stats.slice(i, i + batchSize);
    await prisma.dailyUserStats.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  return stats.length;
};

/**
 * Simple concurrency limiter — run at most `concurrency` promises at once.
 * Avoids P2028 (too many simultaneous transactions) while being faster than sequential.
 */
const createLimiter = (concurrency: number) => {
  let active = 0;
  const queue: (() => void)[] = [];
  const next = () => {
    if (queue.length && active < concurrency) {
      active++;
      queue.shift()!();
    }
  };
  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise((resolve, reject) => {
      queue.push(() => {
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            next();
          });
      });
      next();
    });
};

// Types for batch creation
interface ListingBatchItem {
  propertyId: number;
  userId: number;
  isRental: boolean;
  tier?: ListingTier;
}

/**
 * Generate base listing data (without relations)
 * @param tier Optional tier - if provided, uses that instead of random weighted tier
 */
const generateBaseListingData = (
  propertyId: number,
  userId: number,
  isRental: boolean,
  tier?: ListingTier,
) => ({
  price: isRental
    ? Math.round(faker.number.float({ min: 300, max: 3000 }))
    : Math.round(faker.number.float({ min: 100000, max: 1000000 })),
  moveInDate: faker.date.future(),
  listingTier: tier ?? generateWeightedListingTier(),
  listingStartDate: new Date(),
  listingEndDate: faker.date.future(),
  viewingOptions: faker.word.words(10),
  ownershipVerified: true,
  published: true,
  publishedAt: generateRandomDate(),
  propertyId,
  userId,
});

/**
 * Generate price history for a listing — simulates 1–3 price changes.
 * Generates historical prices working backwards from the current price.
 * @param isIncrease When true, the price has increased over time (old price is lower than current).
 *                   When false (default), the price has been reduced (old price was higher).
 */
export const generatePriceHistory = async (
  listingId: number,
  currentPrice: number,
  isIncrease = false,
): Promise<void> => {
  const changeCount = faker.number.int({ min: 1, max: 3 });
  const entries = [];
  let price = currentPrice;

  for (let i = 0; i < changeCount; i++) {
    const changePct = faker.number.float({ min: 1, max: 15 });
    // Decrease: old price was higher (price was reduced over time)
    // Increase: old price was lower (price has gone up over time)
    const oldPrice = isIncrease
      ? Math.round(price * (1 - changePct / 100))
      : Math.round(price * (1 + changePct / 100));
    const changePercent = ((price - oldPrice) / oldPrice) * 100;
    const daysAgo = faker.number.int({ min: (i + 1) * 7, max: (i + 1) * 60 });
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    entries.push({
      listingId,
      oldPrice,
      newPrice: price,
      changePercent,
      createdAt,
    });

    price = oldPrice; // walk further back in time
  }

  await prisma.listingPriceHistory.createMany({ data: entries });
};

/**
 * Batch create listings with their rental/sale records.
 * Uses bounded concurrency (5 at a time) to avoid P2028 on Railway
 * while being much faster than purely sequential creation.
 */
export const batchCreateListings = async (
  items: ListingBatchItem[],
): Promise<number[]> => {
  if (items.length === 0) return [];

  // 5 concurrent listing creates — safe for Railway Prisma Postgres connection pool
  const listingLimiter = createLimiter(5);
  // 3 concurrent analytics workers — keeps DB load low during analytics phase
  const analyticsLimiter = createLimiter(3);

  let created = 0;
  const analyticsPromises: Promise<unknown>[] = [];

  const allListings = await Promise.all(
    items.map((item) =>
      listingLimiter(async () => {
        const result = await prisma.listing.create({
          data: {
            ...generateBaseListingData(
              item.propertyId,
              item.userId,
              item.isRental,
              item.tier,
            ),
            ...(item.isRental
              ? { rentalListing: { create: generateRentalObject() } }
              : { saleListing: { create: generateSaleObject() } }),
          },
          select: { id: true, userId: true, price: true },
        });

        // 50% of listings get price history; of those, 50% are price increases
        if (Math.random() < 0.5) {
          const isIncrease = Math.random() < 0.5;
          await generatePriceHistory(result.id, result.price, isIncrease);
        }

        // Start analytics immediately for this listing (don't wait for all listings first)
        analyticsPromises.push(
          analyticsLimiter(() =>
            Promise.all([
              generateListingViews(result.id),
              generateListingImpressions(result.id),
              ...(result.userId
                ? [generateDailyListingStats(result.id, result.userId)]
                : []),
            ]).catch((err) =>
              console.error(`Analytics error for listing ${result.id}:`, err),
            ),
          ),
        );

        created++;
        if (created % 200 === 0 || created === items.length) {
          console.log(`  📦 Created ${created}/${items.length} listings...`);
        }

        return result;
      }),
    ),
  );

  // Wait for all analytics to complete before returning so process.exit() doesn't kill them
  console.log("⏳ Awaiting analytics generation...");
  await Promise.all(analyticsPromises);
  console.log("✅ All analytics generated.");

  return allListings.map((r) => r.id);
};

/**
 * Gnerate a full random SALE Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateRentalListing = async (
  propertyId: number,
  userId: number,
): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      price: Math.round(faker.number.float({ min: 300, max: 3000 })),
      moveInDate: faker.date.future(),
      listingTier: generateWeightedListingTier(),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      ownershipVerified: true,
      rentalListing: {
        create: generateRentalObject(),
      },
      published: true,
      publishedAt: generateRandomDate(),
      property: {
        connect: {
          id: propertyId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  // Generate analytics data in background (don't await)
  Promise.all([
    generateListingViews(listing.id),
    generateListingImpressions(listing.id),
    generateDailyListingStats(listing.id, userId),
  ])
    .then(([views, impressions, _dailyStats]) => {
      console.log(
        `📊 Rental #${listing.id}: ${views} views, ${impressions} impressions`,
      );
    })
    .catch((error) => {
      console.error(
        `Error generating analytics for rental listing ${listing.id}:`,
        error,
      );
    });

  return listing;
};

/**
 * Gnerate a full random RENTAL Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateSaleListing = async (
  propertyId: number,
  userId: number,
): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      price: Math.round(faker.number.float({ min: 100000, max: 1000000 })),
      moveInDate: faker.date.future(),
      listingTier: generateWeightedListingTier(),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      ownershipVerified: true,
      saleListing: {
        create: generateSaleObject(),
      },
      published: true,
      publishedAt: generateRandomDate(),
      property: {
        connect: {
          id: propertyId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  // Generate analytics data in background (don't await)
  Promise.all([
    generateListingViews(listing.id),
    generateListingImpressions(listing.id),
    generateDailyListingStats(listing.id, userId),
  ])
    .then(([views, impressions, _dailyStats]) => {
      console.log(
        `📊 Sale #${listing.id}: ${views} views, ${impressions} impressions`,
      );
    })
    .catch((error) => {
      console.error(
        `Error generating analytics for sale listing ${listing.id}:`,
        error,
      );
    });

  return listing;
};
