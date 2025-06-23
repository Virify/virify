import * as z from "zod";
import { PrismaClient, FurnishedStatus, RentalAvailabilityStatus, TenureType, OwnershipType, SalePriceType, SaleAvailabilityStatus } from "@prisma/client";
import OpenAI from "openai";
import { getPropertyIdsByDistance, getNearbyPropertiesByTextQuery } from "../../../utils/location";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ragSearchSchema = z.object({
  query: z.string().optional(),
  whereClause: z.record(z.any()).optional(), // Allow direct WHERE clause
  limit: z.coerce.number().min(1).max(1000).optional().default(1000),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  radius: z.coerce.number().optional().default(40),
}).refine(data => data.query || data.whereClause, {
  message: "Either query or whereClause must be provided"
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = ragSearchSchema.parse(body);
    const { query, whereClause: inputWhereClause, limit, lat, lon, radius } = validatedData;

    // If whereClause is provided, skip AI generation and use it directly
    if (inputWhereClause) {
      console.log(`Direct search with provided WHERE clause:`, JSON.stringify(inputWhereClause, null, 2));
      
      // Ensure published is always true
      const finalWhereClause = {
        published: true,
        ...inputWhereClause,
      };

      const listings = await prisma.listing.findMany({
        where: finalWhereClause,
        include: {
          property: {
            include: {
              address: true,
              media: true,
              type: true,
              classification: true,
              bedroomFeatures: true,
              bathroomFeatures: true,
              parking: true,
              amenities: true,
              additionalFeatures: true,
              accessibilityFeatures: true,
              diningroomFeatures: true,
              kitchenFeatures: true,
              livingAreaFeatures: true,
              reception: true,
              utility: true,
              additionalToilet: true,
              outdoorSpace: true,
              energyAndUtilities: true,
              securityFeatures: true,
              storageFeatures: true,
              runningCosts: true,
            },
          },
          rentalListing: true,
          saleListing: true,
        },
        take: limit,
      });

      console.log(`Found ${listings.length} listings with direct WHERE clause`);

      // Format results (reuse existing formatting logic)
      const formattedResults = listings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        publishedAt: listing.publishedAt,
        listingTier: listing.listingTier,
        moveInDate: listing.moveInDate,
        similarity: 1.0,
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
              // Include all property features
              bedroomFeatures: listing.property.bedroomFeatures,
              bathroomFeatures: listing.property.bathroomFeatures,
              parking: listing.property.parking,
              amenities: listing.property.amenities,
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
              runningCosts: listing.property.runningCosts,
            }
          : undefined,
        listingType: listing.rentalListing ? ("rent" as const) : listing.saleListing ? ("buy" as const) : ("unknown" as const),
      }));

      return {
        results: formattedResults,
        query: "Direct WHERE clause search",
        generatedWhereClause: finalWhereClause,
        count: formattedResults.length,
        searchType: "direct_sql",
      };
    }

    // Original AI-powered search logic (query is guaranteed to exist here)
    if (!query) {
      throw createError({
        statusCode: 400,
        statusMessage: "Query is required for AI search",
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: "AI search is not configured. Please contact support.",
      });
    }

    console.log(`RAG Search query: "${query}"`);
    if (lat && lon) {
      console.log(`Location: ${lat}, ${lon} within ${radius} miles`);
    }

    // Check if this is a location-based query
    let propertyIds: number[] | null = null;
    let locationContext = "";
    let searchRadius = radius; // Default from API parameter

    // If lat/lon provided, use location filtering
    if (lat && lon) {
      const nearbyProperties = await getPropertyIdsByDistance(lat, lon, searchRadius);
      propertyIds = nearbyProperties.map((p) => p.propertyId);
      locationContext = `within ${searchRadius} miles of ${lat}, ${lon}`;
    }
    // If query contains location terms but no lat/lon, try to extract location
    else if (
      query.toLowerCase().includes("near") ||
      query.toLowerCase().includes(" in cardiff") ||
      query.toLowerCase().includes(" in newport") ||
      query.toLowerCase().includes(" in london") ||
      query.toLowerCase().includes(" in birmingham") ||
      query.toLowerCase().includes("cardiff") ||
      query.toLowerCase().includes("newport") ||
      query.toLowerCase().includes("london") ||
      query.toLowerCase().includes("birmingham") ||
      query.toLowerCase().includes("of cardiff") ||
      query.toLowerCase().includes("of newport") ||
      query.toLowerCase().includes("of london") ||
      query.toLowerCase().includes("of birmingham")
    ) {
      // Extract radius from query if specified (e.g., "5 miles", "10 miles")
      const radiusMatch = query.match(/(\d+)\s*miles?/i);
      if (radiusMatch && radiusMatch[1]) {
        const extractedRadius = parseInt(radiusMatch[1]);
        if (extractedRadius > 0 && extractedRadius <= 50) {
          // Reasonable limits
          searchRadius = extractedRadius;
        }
      }

      // Extract potential location from query - more specific regex for actual locations
      const locationMatch = query.match(/(?:near|in|of)\s+(cardiff|newport|london|birmingham)/i) || query.match(/(cardiff|newport|london|birmingham)/i);

      if (locationMatch && locationMatch[1]) {
        const locationQuery = locationMatch[1].trim();
        try {
          console.log(`Attempting location search for: "${locationQuery}" within ${searchRadius} miles`);
          const nearbyProperties = await getNearbyPropertiesByTextQuery(locationQuery, searchRadius);
          propertyIds = nearbyProperties.map((p) => p.propertyId);
          locationContext = `near ${locationQuery} within ${searchRadius} miles`;
          console.log(`Found ${propertyIds.length} properties ${locationContext}`);
        } catch (error) {
          console.log(`Could not find location: ${locationQuery}`, error);
        }
      }
    }

    // Define the schema for the AI to understand
    const schemaPrompt = `
You are an AI that converts natural language property search queries into complete Prisma WHERE clause conditions.

Available property types:
- House, Cottage, Bungalow, Flat, Land, Farms, Specialty, Student Accommodation

Available classifications:
- For Houses: Terraced, Semi-detached, End of terrace, Detached, Mansion
- For Cottages: Terraced, Detached, Semi-detached, End of terrace
- For Bungalows: Terraced, Semi-detached, End of terrace, Detached
- For Flats: Converted flat, Studio flat, Maisonette, High-rise, Within a complex, Penthouse
- For Land: Residential Land, Commercial Land, Agricultural Land, Development plot, Development potential
- For Farms: Non-working Farmhouse, Working Farm, Small Holding
- For Specialty: Shared Ownership, Retirement Homes, New Build Homes
- For Student Accommodation: Flat, House, House-share

Property fields available:
- numberBedrooms (1-10+)
- numberBathrooms (1-10+)
- numberReceptions (1-10+)
- size (square meters)
- yearBuilt (string)
- chainFree (boolean)
- vacant (boolean)
- type.name (property type)
- classification.name (classification)

COMPREHENSIVE PROPERTY FEATURES (use nested objects):

PARKING features (property.parking.{field}):
- garage (boolean) - "garage", "with garage"
- driveway (boolean) - "driveway", "with driveway"
- permitParking (boolean) - "permit parking"
- onStreet (boolean) - "on street parking"
- noParking (boolean) - "no parking"
- carport (boolean) - "carport"
- allocatedParking (boolean) - "allocated parking"
- evCharging (boolean) - "EV charging", "electric car charging"

ACCESSIBILITY features (property.accessibilityFeatures.{field}):
- wheelchairFriendly (boolean) - "wheelchair access", "wheelchair friendly"
- stepFreeAccess (boolean) - "step free", "step free access"
- wideDoorways (boolean) - "wide doorways"
- wetRoom (boolean) - "wet room"
- handrails (boolean) - "handrails"
- elevator (boolean) - "elevator", "lift"
- stairs (boolean) - "stairs"
- accessibleParking (boolean) - "accessible parking"

SECURITY features (property.securityFeatures.{field}):
- gatedCommunity (boolean) - "gated community", "gated"
- cctv (boolean) - "CCTV", "security cameras"
- alarmSystem (boolean) - "alarm", "security alarm"
- neighborhoodWatch (boolean) - "neighborhood watch"
- intercomSystem (boolean) - "intercom"
- security (boolean) - "security", "24/7 security"
- reception (boolean) - "reception", "concierge"

ADDITIONAL features (property.additionalFeatures.{field}):
- petFriendly (boolean) - "pet friendly", "pets allowed"
- homeOffice (boolean) - "home office", "office space"
- pool (boolean) - "pool", "swimming pool"
- internet (boolean) - "internet", "wifi"
- cableTv (boolean) - "cable TV"
- phone (boolean) - "phone line"
- laundry (boolean) - "laundry"
- concierge (boolean) - "concierge"
- shop (boolean) - "shop", "convenience store"
- gym (boolean) - "gym", "fitness"

KITCHEN features (property.kitchenFeatures.{field}):
- modern (boolean) - "modern kitchen"
- openPlan (boolean) - "open plan kitchen"
- whiteGoods (boolean) - "white goods", "appliances included"
- breakfastBar (boolean) - "breakfast bar"
- island (boolean) - "kitchen island"
- utilityAccess (boolean) - "utility access"
- pantry (boolean) - "pantry"

LIVING AREA features (property.livingAreaFeatures.{field}):
- fireplace (string) - "fireplace" -> use "OPEN_FIRE" or "LOG_BURNER"
- balcony (boolean) - "balcony"
- openPlan (boolean) - "open plan living"

DINING ROOM features (property.diningroomFeatures.{field}):
- openConcept (boolean) - "open concept dining"

BEDROOM features (property.bedroomFeatures array - check individual bedroom):
- bed (array) - "double bed" -> ["DOUBLE"], "king bed" -> ["KING"], etc.
- enSuite (boolean) - "en-suite", "ensuite"
- builtInStorage (boolean) - "built in storage"
- walkInWardrobe (boolean) - "walk in wardrobe"

BATHROOM features (property.bathroomFeatures array):
- enSuite (boolean) - "en-suite bathroom"
- bathtub (boolean) - "bathtub", "bath"
- walkInShower (boolean) - "walk in shower"
- downstairs (boolean) - "downstairs bathroom"
- upstairs (boolean) - "upstairs bathroom"

OUTDOOR features (property.outdoorSpace.{field}):
- frontGarden (boolean) - "front garden"
- rearGarden (boolean) - "garden", "rear garden", "back garden"
- sunTerrace (boolean) - "sun terrace"
- terrace (boolean) - "terrace"
- balcony (boolean) - "balcony"
- patio (boolean) - "patio"
- separateParcel (boolean) - "separate land parcel"
- shed (boolean) - "shed"
- summerHouse (boolean) - "summer house"
- gardenOffice (boolean) - "garden office"
- pool (boolean) - "pool", "swimming pool"

STORAGE features (property.storageFeatures.{field}):
- attic (boolean) - "attic", "loft storage"
- basement (boolean) - "basement"
- separateDressing (boolean) - "separate dressing room"
- underStairsStorage (boolean) - "under stairs storage"
- pantry (boolean) - "pantry storage"

ENERGY AND UTILITIES features (property.energyAndUtilities.{field}):
- epcRating (string) - "EPC A", "energy rating B" -> "A", "B", etc.
- primaryHeatingType (array) - "gas central heating" -> {"has": "GAS_CENTRAL"}
- secondaryHeatingType (array) - "electric heating" -> {"has": "ELECTRIC"}
- boilerType (string) - "combi boiler" -> "COMBI_BOILER"
- hotWaterSource (string) - "boiler" -> "BOILER"
- renewables (array) - "solar panels" -> {"has": "SOLAR_PV"}
- connectedUtilities (array) - "mains gas" -> {"has": "GAS"}
- broadbandType (string) - "fibre" -> "FTTP"
- fullFibreAvailable (boolean) - "full fibre available"

UTILITY features (property.utility.{field}):
- appliances (array) - "washing machine" -> {"has": "Washing Machine"}
- storage (boolean) - "utility storage"
- sink (boolean) - "utility sink"
- plumbing (boolean) - "utility plumbing"

ADDITIONAL TOILET features (property.additionalToilet.{field}):
- downstairs (boolean) - "downstairs toilet"
- upstairs (boolean) - "upstairs toilet"
- guestCloakroom (boolean) - "guest cloakroom"

RECEPTION features (property.reception array):
- openPlan (boolean) - "open plan reception"
- fireplace (string) - "reception fireplace"
- gamesRoom (boolean) - "games room"
- homeCinema (boolean) - "home cinema"

AMENITIES (property.amenities array with type/subtype):
- type: "TRANSPORT", "EDUCATION", "HEALTHCARE", "SHOPPING_ENTERTAINMENT", "GREEN_SPACE"
- subtype: "TRAIN_STATION", "BUS_STOP", "MOTORWAY_ACCESS", "SCHOOL", "UNIVERSITY", "HOSPITAL", "MEDICAL_CENTRE", "SHOP", "RESTAURANT", "CINEMA", "GYM", "PARK", "TRAIL", "PLAYGROUND", "OTHER"
- "near train station" -> property: {amenities: {some: {type: "TRANSPORT", subtype: "TRAIN_STATION"}}}
- "close to school" -> property: {amenities: {some: {type: "EDUCATION", subtype: "SCHOOL"}}}
- "near shops" -> property: {amenities: {some: {type: "SHOPPING_ENTERTAINMENT", subtype: "SHOP"}}}
- "near park" -> property: {amenities: {some: {type: "GREEN_SPACE", subtype: "PARK"}}}
- "hospital nearby" -> property: {amenities: {some: {type: "HEALTHCARE", subtype: "HOSPITAL"}}}

RUNNING COSTS features (property.runningCosts.{field}):
- councilTaxBand (string) - "council tax band A" -> "A", "council tax band B" -> "B", etc.
- serviceCharges (number) - "low service charges", "service charges under 100"
- groundRent (number) - "low ground rent", "no ground rent" -> 0

Convert the user query into a complete Prisma WHERE clause JSON object.
IGNORE location terms like "in Cardiff", "near Newport" - these are handled separately.
Only include conditions that are explicitly mentioned or strongly implied in the query.

IMPORTANT: Extract bedroom numbers from common variations:
- "1 bed", "1 bedroom", "1-bed", "one bedroom" -> property: {numberBedrooms: 1}
- "2 bed", "2 bedroom", "2-bed", "two bedroom" -> property: {numberBedrooms: 2}
- "3 bed", "3 bedroom", "3-bed", "three bedroom" -> property: {numberBedrooms: 3}
- "4 bed", "4 bedroom", "4-bed", "four bedroom" -> property: {numberBedrooms: 4}
- "5 bed", "5 bedroom", "5-bed", "five bedroom" -> property: {numberBedrooms: 5}
- "studio" -> property: {numberBedrooms: 0, type: {name: "Flat"}, classification: {name: "Studio flat"}}

CRITICAL: Generate complete Prisma WHERE clause structure including ALL conditions:

BASIC STRUCTURE:
{
  "published": true,
  "property": { /* all property conditions go here */ },
  "saleListing": { /* sale listing conditions or null check */ },
  "rentalListing": { /* rental listing conditions or null check */ },
  "price": { /* price range conditions */ }
}

LISTING TYPE FILTERING:
- For sale properties: "saleListing": {"isNot": null}
- For rental properties: "rentalListing": {"isNot": null}  
- For both sale and rental: omit both saleListing and rentalListing filters
- For specific rental features: "rentalListing": {"furnishedStatus": "FURNISHED", "isBillsIncluded": true}
- For specific sale features: "saleListing": {"tenureType": "FREEHOLD", "chain": false}

PRICE FILTERING:
- Sales under £300k: "price": {"lte": 300000}
- Sales over £500k: "price": {"gte": 500000}
- Sales £200k-£400k: "price": {"gte": 200000, "lte": 400000}
- Rentals under £1000/month: "price": {"lte": 1000}
- Rentals £800-£1200/month: "price": {"gte": 800, "lte": 1200}
- Convert weekly rental prices to monthly: weekly * 52 / 12 = monthly
- Sales prices in k = thousands (£200k = £200000)

RENTAL FEATURES (rentalListing object):
- furnishedStatus: "FURNISHED", "UNFURNISHED", "PART_FURNISHED"
- availabilityStatus: "AVAILABLE", "LET_AGREED", "LET"
- isBillsIncluded: true/false

SALE FEATURES (saleListing object):
- tenureType: "FREEHOLD", "LEASEHOLD", "COMMONHOLD", "SHARE_OF_FREEHOLD"
- ownershipType: "FULL_OWNERSHIP", "SHARED_OWNERSHIP", "PARTIAL_OWNERSHIP", "JOINT_OWNERSHIP"
- priceType: "FIXED", "OFFERS_OVER", "GUIDE_PRICE"
- availabilityStatus: "AVAILABLE", "UNDER_OFFER", "SOLD"
- chain: false (for chain free properties)

COMPLETE EXAMPLES:

"3 bedroom house" -> 
{
  "published": true,
  "property": {
    "numberBedrooms": 3,
    "type": {"name": "House"}
  }
}

"flat for sale under £300k" -> 
{
  "published": true,
  "property": {
    "type": {"name": "Flat"}
  },
  "saleListing": {"isNot": null},
  "price": {"lte": 300000}
}

"furnished flat to rent under £1000 per month" -> 
{
  "published": true,
  "property": {
    "type": {"name": "Flat"}
  },
  "rentalListing": {
    "furnishedStatus": "FURNISHED"
  },
  "price": {"lte": 1000}
}

"freehold house for sale over £500k with garage" -> 
{
  "published": true,
  "property": {
    "type": {"name": "House"},
    "parking": {"garage": true}
  },
  "saleListing": {
    "tenureType": "FREEHOLD"
  },
  "price": {"gte": 500000}
}

"chain free property for sale" -> 
{
  "published": true,
  "property": {},
  "saleListing": {
    "chain": false
  }
}

"detached house with garage and CCTV" -> 
{
  "published": true,
  "property": {
    "type": {"name": "House"},
    "classification": {"name": "Detached"},
    "parking": {"garage": true},
    "securityFeatures": {"cctv": true}
  }
}

"wheelchair accessible flat with elevator" -> 
{
  "published": true,
  "property": {
    "type": {"name": "Flat"},
    "accessibilityFeatures": {
      "wheelchairFriendly": true,
      "elevator": true
    }
  }
}

"house with solar panels and EV charging" -> 
{
  "published": true,
  "property": {
    "type": {"name": "House"},
    "energyAndUtilities": {
      "renewables": {"has": "SOLAR_PV"}
    },
    "parking": {"evCharging": true}
  }
}

"house near train station" -> 
{
  "published": true,
  "property": {
    "type": {"name": "House"},
    "amenities": {
      "some": {
        "type": "TRANSPORT",
        "subtype": "TRAIN_STATION"
      }
    }
  }
}

"property with council tax band A and low service charges" -> 
{
  "published": true,
  "property": {
    "runningCosts": {
      "councilTaxBand": "A",
      "serviceCharges": {"lt": 200}
    }
  }
}

"house with en-suite bedroom" -> 
{
  "published": true,
  "property": {
    "type": {"name": "House"},
    "bedroomFeatures": {
      "some": {"enSuite": true}
    }
  }
}

"bills included rental under £250 per week" -> 
{
  "published": true,
  "property": {},
  "rentalListing": {
    "isBillsIncluded": true
  },
  "price": {"lte": 1083}
}

Return ONLY the complete JSON Prisma WHERE clause object, no other text.
`;

    // Get AI to generate the complete WHERE clause
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: schemaPrompt },
        { role: "user", content: `Convert this search query to a complete Prisma WHERE clause: "${query}"` },
      ],
      temperature: 0,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim();
    if (!aiResponse) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to generate search conditions",
      });
    }

    console.log(`AI generated WHERE clause: ${aiResponse}`);

    // Clean up the AI response - remove markdown code blocks if present
    let cleanedResponse = aiResponse;
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let whereClause: any = {};
    try {
      whereClause = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", aiResponse);
      console.error("Cleaned response:", cleanedResponse);
      console.error("Parse error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid WHERE clause generated. AI response: ${aiResponse}`,
      });
    }

    // Ensure the basic structure is correct
    if (!whereClause.published) {
      whereClause.published = true;
    }

    // Add location filtering if we have property IDs
    if (propertyIds !== null) {
      if (propertyIds.length === 0) {
        // No properties found in location - return empty results
        return {
          results: [],
          query,
          generatedWhereClause: whereClause,
          locationContext,
          count: 0,
          searchType: "rag_sql",
        };
      }
      
      // Ensure property object exists
      if (!whereClause.property) {
        whereClause.property = {};
      }
      
      // Add location filter to property conditions
      whereClause.property.id = { in: propertyIds };
    }

    // Execute the search with AI-generated WHERE clause
    console.log("Executing search with WHERE clause:", JSON.stringify(whereClause, null, 2));

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            address: true,
            media: true,
            type: true,
            classification: true,
            bedroomFeatures: true,
            bathroomFeatures: true,
            parking: true,
            amenities: true,
            additionalFeatures: true,
            accessibilityFeatures: true,
            diningroomFeatures: true,
            kitchenFeatures: true,
            livingAreaFeatures: true,
            reception: true,
            utility: true,
            additionalToilet: true,
            outdoorSpace: true,
            energyAndUtilities: true,
            securityFeatures: true,
            storageFeatures: true,
            runningCosts: true,
          },
        },
        rentalListing: true,
        saleListing: true,
      },
      // Don't apply limit if query contains "all properties" or similar broad terms
      ...(query.toLowerCase().includes("all properties") || query.toLowerCase().includes("all houses") || query.toLowerCase().includes("all flats") || limit >= 1000 ? {} : { take: limit }),
    });

    console.log(`Found ${listings.length} listings matching conditions`);

    // Format results
    const formattedResults = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      publishedAt: listing.publishedAt,
      listingTier: listing.listingTier,
      moveInDate: listing.moveInDate,
      similarity: 1.0, // Perfect match since it's exact SQL filtering
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
            // Include all property features
            bedroomFeatures: listing.property.bedroomFeatures,
            bathroomFeatures: listing.property.bathroomFeatures,
            parking: listing.property.parking,
            amenities: listing.property.amenities,
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
            runningCosts: listing.property.runningCosts,
          }
        : undefined,
      listingType: listing.rentalListing ? ("rent" as const) : listing.saleListing ? ("buy" as const) : ("unknown" as const),
    }));

    return {
      results: formattedResults,
      query,
      generatedWhereClause: whereClause,
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
