// imports require .ts extension to run seed
import { faker } from "@faker-js/faker";
import type { Prisma, Listing } from "../../../database/server/database/prisma/generated/client";
import { RentalPriceType, FurnishedStatus, RentalAvailabilityStatus, TenureType, SalePriceType, SaleAvailabilityStatus, ListingTier, VerificationLevel } from "../../../database/server/database/prisma/generated/enums";
import { roundFloat } from "../../../../shared/utils/numbers";
import { prisma } from "../../../database/server/utils/prisma-client";
/**
 * Generate a random date between 1, 3, 7, and 14 days ago.
 */
export const generateRandomDate = ()  => {
  const daysOptions = [1, 3, 7, 14];
  const randomDays = daysOptions[Math.floor(Math.random() * daysOptions.length)];
  return faker.date.recent({ days: randomDays });
}

/**
 * Generate a random RentalListing object
 * 
 * @returns RentalListing
 */
export const generateRentalObject = (): Prisma.RentalListingCreateWithoutListingInput => {
  return {
    deposit: roundFloat(faker.number.float({ min: 1000, max: 10000 }), 2),
    holdingDeposit: roundFloat(faker.number.float({ min: 1000, max: 10000 }), 2),
    rentFrequency: faker.helpers.arrayElement(Object.values(RentalPriceType)),
    isBillsIncluded: faker.datatype.boolean(),
    rentalLength: faker.helpers.arrayElement(['SHORT_TERM', 'LONG_TERM']),
    furnishedStatus: faker.helpers.arrayElement(Object.values(FurnishedStatus)),
    availabilityStatus: faker.helpers.arrayElement(Object.values(RentalAvailabilityStatus)),
  };
};

/**
 * Generate a random SaleListing object
 * 
 * @returns SaleListing
 */
export const generateSaleObject = (): Prisma.SaleListingCreateWithoutListingInput => {
  return {
    tenureType: faker.helpers.arrayElement(Object.values(TenureType)),
    chain: faker.datatype.boolean(),
    sharedOwnership: faker.datatype.boolean(),
    priceType: faker.helpers.arrayElement(Object.values(SalePriceType)),
    availabilityStatus: faker.helpers.arrayElement(Object.values(SaleAvailabilityStatus)),
  }
}

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
  return faker.number.int({ min: 0, max: 50 });
};

// Common user agents for realistic seed data
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

// Common referrer sources
const referrers = [
  'https://www.google.com/',
  'https://www.google.co.uk/',
  'https://www.facebook.com/',
  'https://twitter.com/',
  null, // Direct traffic
  null,
  null,
];

// Traffic sources for analytics
const viewSources = ['search', 'direct', 'social', 'email', 'referral'] as const;

/**
 * Generate random listing views for a listing with enhanced analytics fields
 * 
 * @param listingId ID of the listing to create views for
 * @returns Promise resolving to the number of views created
 */
export const generateListingViews = async (listingId: number): Promise<number> => {
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
      createdAt: viewDate
    });
  }
  
  // Create the views in batches for better performance
  const batchSize = 100;
  for (let i = 0; i < views.length; i += batchSize) {
    const batch = views.slice(i, i + batchSize);
    await prisma.listingView.createMany({
      data: batch
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
export const generateListingImpressions = async (listingId: number): Promise<number> => {
  const impressionCount = faker.number.int({ min: 50, max: 500 }); // More impressions than views
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
      createdAt: impressionDate
    });
  }
  
  // Create in batches
  const batchSize = 100;
  for (let i = 0; i < impressions.length; i += batchSize) {
    const batch = impressions.slice(i, i + batchSize);
    await prisma.listingImpression.createMany({
      data: batch
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
export const generateDailyListingStats = async (listingId: number, userId: number): Promise<number> => {
  const stats = [];
  
  // Generate stats for the past 30 days
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Normalize to midnight
    
    const views = faker.number.int({ min: 0, max: 20 });
    const impressions = faker.number.int({ min: views * 3, max: views * 10 }); // More impressions than views
    const uniqueViews = Math.floor(views * 0.7); // ~70% unique
    const favourites = Math.random() < 0.3 ? faker.number.int({ min: 0, max: 3 }) : 0; // Some days get favourites
    const enquiries = Math.random() < 0.1 ? faker.number.int({ min: 0, max: 2 }) : 0; // Rare enquiries
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
      avgDuration
    });
  }
  
  // Create in batches
  const batchSize = 30;
  for (let i = 0; i < stats.length; i += batchSize) {
    const batch = stats.slice(i, i + batchSize);
    await prisma.dailyListingStats.createMany({
      data: batch,
      skipDuplicates: true // Prevent duplicate date conflicts
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
export const generateDailyUserStats = async (userId: number): Promise<number> => {
  const stats = [];
  
  // Generate stats for the past 30 days
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0); // Normalize to midnight
    
    const listingViews = faker.number.int({ min: 0, max: 100 });
    const totalImpressions = faker.number.int({ min: listingViews * 3, max: listingViews * 10 });
    const enquiriesReceived = Math.random() < 0.2 ? faker.number.int({ min: 0, max: 5 }) : 0;
    const enquiriesSent = Math.random() < 0.15 ? faker.number.int({ min: 0, max: 3 }) : 0;
    const favouritesReceived = Math.random() < 0.3 ? faker.number.int({ min: 0, max: 5 }) : 0;
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
      skipDuplicates: true
    });
  }
  
  return stats.length;
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
const generateBaseListingData = (propertyId: number, userId: number, isRental: boolean, tier?: ListingTier) => ({
  price: isRental 
    ? roundFloat(faker.number.float({ min: 300, max: 3000 }), 2)
    : roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
  moveInDate: faker.date.future(),
  listingTier: tier ?? generateWeightedListingTier(),
  listingStartDate: new Date(),
  listingEndDate: faker.date.future(),
  viewingOptions: faker.word.words(10),
  verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
  published: true,
  publishedAt: generateRandomDate(),
  propertyId,
  userId,
});

/**
 * Batch create listings with their rental/sale records
 * Much faster than creating one at a time
 */
export const batchCreateListings = async (items: ListingBatchItem[]): Promise<number[]> => {
  if (items.length === 0) return [];

  const BATCH_SIZE = 50;
  const createdListingIds: number[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    
    // Create listings in a transaction for each batch
    const results = await prisma.$transaction(
      batch.map(item => 
        prisma.listing.create({
          data: {
            ...generateBaseListingData(item.propertyId, item.userId, item.isRental, item.tier),
            ...(item.isRental 
              ? { rentalListing: { create: generateRentalObject() } }
              : { saleListing: { create: generateSaleObject() } }
            ),
          },
          select: { id: true, userId: true },
        })
      )
    );

    createdListingIds.push(...results.map(r => r.id));
    
    // Generate analytics in background for this batch
    const analyticsPromises = results.map(listing => 
      Promise.all([
        generateListingViews(listing.id),
        generateListingImpressions(listing.id),
        ...(listing.userId ? [generateDailyListingStats(listing.id, listing.userId)] : []),
      ]).catch(err => console.error(`Analytics error for listing ${listing.id}:`, err))
    );
    
    // Don't await - let analytics run in background
    Promise.all(analyticsPromises).then(() => {
      console.log(`📊 Analytics generated for batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    });

    if ((i + BATCH_SIZE) % 200 === 0 || i + BATCH_SIZE >= items.length) {
      console.log(`  📦 Created ${Math.min(i + BATCH_SIZE, items.length)}/${items.length} listings...`);
    }
  }

  return createdListingIds;
};

/**
 * Gnerate a full random SALE Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateRentalListing = async (propertyId: number, userId: number): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      price: roundFloat(faker.number.float({ min: 300, max: 3000 }), 2),
      moveInDate: faker.date.future(),
      listingTier: generateWeightedListingTier(),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
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
  ]).then(([views, impressions, _dailyStats]) => {
    console.log(`📊 Rental #${listing.id}: ${views} views, ${impressions} impressions`);
  }).catch(error => {
    console.error(`Error generating analytics for rental listing ${listing.id}:`, error);
  });

  return listing;
};

/**
 * Gnerate a full random RENTAL Listing object
 *
 * @param propertyId number
 * @returns Listing
 */
export const generateSaleListing = async (propertyId: number, userId: number): Promise<Prisma.ListingCreateInput> => {
  const listing: Listing = await prisma.listing.create({
    data: {
      price: roundFloat(faker.number.float({ min: 100000, max: 1000000 }), 2),
      moveInDate: faker.date.future(),
      listingTier: generateWeightedListingTier(),
      listingStartDate: new Date(),
      listingEndDate: faker.date.future(),
      viewingOptions: faker.word.words(10),
      verificationLevel: faker.helpers.arrayElement(Object.values(VerificationLevel)),
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
      }
    },
  });

  // Generate analytics data in background (don't await)
  Promise.all([
    generateListingViews(listing.id),
    generateListingImpressions(listing.id),
    generateDailyListingStats(listing.id, userId),
  ]).then(([views, impressions, _dailyStats]) => {
    console.log(`📊 Sale #${listing.id}: ${views} views, ${impressions} impressions`);
  }).catch(error => {
    console.error(`Error generating analytics for sale listing ${listing.id}:`, error);
  });

  return listing;
};
