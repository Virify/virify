import * as z from "zod";
import type { SearchResult } from "~~/shared/types/search";
import { generateWhereClauseFromQuery } from "../../../utils/ai-search";
import { getPropertyIdsByDistance } from "../../../utils/location";
import { propertyInclude } from "../../../utils/property";

const ragSearchSchema = z.object({
  query: z.string().min(1, "Query is required"),
  limit: z.coerce.number().min(1).max(1000).optional().default(1000),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  radius: z.coerce.number().optional().default(40),
});

// Include clause that matches ListingWithFullProperty type
const includeClause = {
  property: {
    include: {
      ...propertyInclude,
    },
  },
  rentalListing: true,
  saleListing: true,
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = ragSearchSchema.parse(body);
    const { query, limit, lat, lon, radius } = validatedData;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: "AI search is not configured. Please contact support.",
      });
    }

    console.log(`RAG Search query: "${query}"`);

    // Handle location filtering first
    let propertyIds: number[] | null = null;
    let locationContext = "";

    if (lat && lon) {
      console.log(`Location: ${lat}, ${lon} within ${radius} miles`);
      try {
        const nearbyProperties = await getPropertyIdsByDistance(lat, lon, radius);
        propertyIds = nearbyProperties.map((p) => p.propertyId);
        locationContext = `within ${radius} miles of ${lat}, ${lon}`;
        console.log(`Found ${propertyIds.length} properties ${locationContext}`);
      } catch (error) {
        console.error(`Error finding properties for coordinates ${lat}, ${lon}:`, error);
        propertyIds = [];
      }
    }

    // Generate AI-powered WHERE clause
    const { whereClause, queryAnalysis } = await generateWhereClauseFromQuery(query, null);

    console.log("AI WHERE clause:", JSON.stringify(whereClause, null, 2));

    // Add location filtering if we have property IDs
    if (propertyIds !== null) {
      if (propertyIds.length === 0) {
        // No properties found in the area, return empty results
        return {
          results: [],
          query,
          generatedWhereClause: whereClause,
          queryAnalysis,
          locationContext,
          count: 0,
          searchType: "rag_sql",
        };
      }

      // Add property ID constraint to WHERE clause
      if (!whereClause.property) {
        whereClause.property = {};
      }
      whereClause.property.id = {
        in: propertyIds,
      };
    }

    console.log("Final WHERE clause:", JSON.stringify(whereClause, null, 2));

    // Execute database query
    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: includeClause,
      ...(shouldApplyLimit(query, limit) ? { take: limit } : {}),
    });

    console.log(`Found ${listings.length} listings matching conditions`);

    // Format results
    const formattedResults = listings.map(
      (listing): SearchResult => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        publishedAt: listing.publishedAt || undefined,
        listingTier: listing.listingTier,
        moveInDate: listing.moveInDate,
        similarity: 1.0,
        listingType: listing.rentalListing ? "rent" : listing.saleListing ? "buy" : "unknown",
        property: listing.property
          ? {
              id: listing.property.id,
              numberBedrooms: listing.property.numberBedrooms,
              numberBathrooms: listing.property.numberBathrooms,
              numberReceptions: listing.property.numberReceptions,
              size: listing.property.size,
              yearBuilt: listing.property.yearBuilt,
              chainFree: listing.property.chainFree,
              vacant: listing.property.vacant,
              constructionType: listing.property.constructionType,
              floorLevel: listing.property.floorLevel,
              address: listing.property.address
                ? {
                    city: listing.property.address.city,
                    county: listing.property.address.county,
                    postcode: listing.property.address.postcode,
                    street: listing.property.address.street,
                    lat: listing.property.address.lat,
                    lon: listing.property.address.lon,
                  }
                : undefined,
              type: listing.property.type
                ? {
                    name: listing.property.type.name,
                  }
                : undefined,
              classification: listing.property.classification
                ? {
                    name: listing.property.classification.name,
                  }
                : undefined,
              bedroomFeatures: listing.property.bedroomFeatures,
              bathroomFeatures: listing.property.bathroomFeatures,
              parking: listing.property.parking,
              amenities: listing.property.amenities ? [listing.property.amenities] : undefined,
              additionalFeatures: listing.property.additionalFeatures,
              accessibilityFeatures: listing.property.accessibilityFeatures,
              diningroomFeatures: listing.property.diningroomFeatures,
              kitchenFeatures: listing.property.kitchenFeatures,
              livingAreaFeatures: listing.property.livingAreaFeatures,
              reception: listing.property.reception,
              utility: listing.property.utility,
              additionalToilet: listing.property.additionalToilet,
              outdoorSpace: listing.property.outdoorSpace,
              energyAndUtilities: listing.property.energyAndUtilities,
              securityFeatures: listing.property.securityFeatures,
              storageFeatures: listing.property.storageFeatures,
            }
          : undefined,
      })
    );

    return {
      results: formattedResults,
      query,
      generatedWhereClause: whereClause,
      queryAnalysis,
      locationContext,
      count: formattedResults.length,
      searchType: "rag_sql",
    };
  } catch (error: any) {
    console.error("Error performing RAG search:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || "Internal server error during RAG search",
    });
  }
});

/**
 * Determine if limit should be applied based on query content
 */
function shouldApplyLimit(query: string, limit: number): boolean {
  const broadTerms = ["all properties", "all houses", "all flats"];
  const queryLower = query.toLowerCase();

  if (limit >= 1000) return false;
  return !broadTerms.some((term) => queryLower.includes(term));
}
