import * as z from "zod";
import { PrismaClient, FurnishedStatus, RentalAvailabilityStatus, TenureType, OwnershipType, SalePriceType, SaleAvailabilityStatus } from "@prisma/client";
import OpenAI from "openai";
import { getPropertyIdsByDistance, getNearbyPropertiesByTextQuery } from "../../../utils/location";

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ragSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  limit: z.coerce.number().min(1).max(1000).optional().default(1000), // Much higher default and max
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  radius: z.coerce.number().optional().default(40), // Default 40 miles
});

/**
 * RAG-based search: AI generates SQL filters from natural language query
 */
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
You are an AI that converts natural language property search queries into Prisma WHERE clause conditions.

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

PARKING features (parking.{field}):
- garage (boolean) - "garage", "with garage"
- driveway (boolean) - "driveway", "with driveway"
- permitParking (boolean) - "permit parking"
- onStreet (boolean) - "on street parking"
- noParking (boolean) - "no parking"
- carport (boolean) - "carport"
- allocatedParking (boolean) - "allocated parking"
- evCharging (boolean) - "EV charging", "electric car charging"

ACCESSIBILITY features (accessibilityFeatures.{field}):
- wheelchairFriendly (boolean) - "wheelchair access", "wheelchair friendly"
- stepFreeAccess (boolean) - "step free", "step free access"
- wideDoorways (boolean) - "wide doorways"
- wetRoom (boolean) - "wet room"
- handrails (boolean) - "handrails"
- elevator (boolean) - "elevator", "lift"
- stairs (boolean) - "stairs"
- accessibleParking (boolean) - "accessible parking"

SECURITY features (securityFeatures.{field}):
- gatedCommunity (boolean) - "gated community", "gated"
- cctv (boolean) - "CCTV", "security cameras"
- alarmSystem (boolean) - "alarm", "security alarm"
- neighborhoodWatch (boolean) - "neighborhood watch"
- intercomSystem (boolean) - "intercom"
- security (boolean) - "security", "24/7 security"
- reception (boolean) - "reception", "concierge"

ADDITIONAL features (additionalFeatures.{field}):
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

KITCHEN features (kitchenFeatures.{field}):
- modern (boolean) - "modern kitchen"
- openPlan (boolean) - "open plan kitchen"
- whiteGoods (boolean) - "white goods", "appliances included"
- breakfastBar (boolean) - "breakfast bar"
- island (boolean) - "kitchen island"
- utilityAccess (boolean) - "utility access"
- pantry (boolean) - "pantry"

LIVING AREA features (livingAreaFeatures.{field}):
- fireplace (string) - "fireplace" -> use "OPEN_FIRE" or "LOG_BURNER"
- balcony (boolean) - "balcony"
- openPlan (boolean) - "open plan living"

DINING ROOM features (diningroomFeatures.{field}):
- openConcept (boolean) - "open concept dining"

BEDROOM features (bedroomFeatures array - check individual bedroom):
- bed (array) - "double bed" -> ["DOUBLE"], "king bed" -> ["KING"], etc.
- enSuite (boolean) - "en-suite", "ensuite"
- builtInStorage (boolean) - "built in storage"
- walkInWardrobe (boolean) - "walk in wardrobe"

BATHROOM features (bathroomFeatures array):
- enSuite (boolean) - "en-suite bathroom"
- bathtub (boolean) - "bathtub", "bath"
- walkInShower (boolean) - "walk in shower"
- downstairs (boolean) - "downstairs bathroom"
- upstairs (boolean) - "upstairs bathroom"

OUTDOOR features (outdoorSpace.{field}):
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

STORAGE features (storageFeatures.{field}):
- attic (boolean) - "attic", "loft storage"
- basement (boolean) - "basement"
- separateDressing (boolean) - "separate dressing room"
- underStairsStorage (boolean) - "under stairs storage"
- pantry (boolean) - "pantry storage"

ENERGY AND UTILITIES features (energyAndUtilities.{field}):
- epcRating (string) - "EPC A", "energy rating B" -> "A", "B", etc.
- primaryHeatingType (array) - "gas central heating" -> {"has": "GAS_CENTRAL"}
- secondaryHeatingType (array) - "electric heating" -> {"has": "ELECTRIC"}
- boilerType (string) - "combi boiler" -> "COMBI_BOILER"
- hotWaterSource (string) - "boiler" -> "BOILER"
- renewables (array) - "solar panels" -> {"has": "SOLAR_PV"}
- connectedUtilities (array) - "mains gas" -> {"has": "GAS"}
- broadbandType (string) - "fibre" -> "FTTP"
- fullFibreAvailable (boolean) - "full fibre available"

UTILITY features (utility.{field}):
- appliances (array) - "washing machine" -> {"has": "Washing Machine"}
- storage (boolean) - "utility storage"
- sink (boolean) - "utility sink"
- plumbing (boolean) - "utility plumbing"

ADDITIONAL TOILET features (additionalToilet.{field}):
- downstairs (boolean) - "downstairs toilet"
- upstairs (boolean) - "upstairs toilet"
- guestCloakroom (boolean) - "guest cloakroom"

RECEPTION features (reception array):
- openPlan (boolean) - "open plan reception"
- fireplace (string) - "reception fireplace"
- gamesRoom (boolean) - "games room"
- homeCinema (boolean) - "home cinema"

AMENITIES (nearby amenities - amenities array with type/subtype):
- type: "TRANSPORT", "EDUCATION", "HEALTHCARE", "SHOPPING_ENTERTAINMENT", "GREEN_SPACE"
- subtype: "TRAIN_STATION", "BUS_STOP", "MOTORWAY_ACCESS", "SCHOOL", "UNIVERSITY", "HOSPITAL", "MEDICAL_CENTRE", "SHOP", "RESTAURANT", "CINEMA", "GYM", "PARK", "TRAIL", "PLAYGROUND", "OTHER"
- "near train station" -> amenities: {some: {type: "TRANSPORT", subtype: "TRAIN_STATION"}}
- "close to school" -> amenities: {some: {type: "EDUCATION", subtype: "SCHOOL"}}
- "near shops" -> amenities: {some: {type: "SHOPPING_ENTERTAINMENT", subtype: "SHOP"}}
- "near park" -> amenities: {some: {type: "GREEN_SPACE", subtype: "PARK"}}
- "hospital nearby" -> amenities: {some: {type: "HEALTHCARE", subtype: "HOSPITAL"}}

RUNNING COSTS features (runningCosts.{field}):
- councilTaxBand (string) - "council tax band A" -> "A", "council tax band B" -> "B", etc.
- serviceCharges (number) - "low service charges", "service charges under 100"
- groundRent (number) - "low ground rent", "no ground rent" -> 0

Convert the user query into a JSON object with Prisma WHERE conditions.
IGNORE location terms like "in Cardiff", "near Newport" - these are handled separately.
Only include conditions that are explicitly mentioned or strongly implied in the query.

IMPORTANT: Extract bedroom numbers from common variations:
- "1 bed", "1 bedroom", "1-bed", "one bedroom" -> numberBedrooms: 1
- "2 bed", "2 bedroom", "2-bed", "two bedroom" -> numberBedrooms: 2
- "3 bed", "3 bedroom", "3-bed", "three bedroom" -> numberBedrooms: 3
- "4 bed", "4 bedroom", "4-bed", "four bedroom" -> numberBedrooms: 4
- "5 bed", "5 bedroom", "5-bed", "five bedroom" -> numberBedrooms: 5
- "studio" -> numberBedrooms: 0 (and type: Flat, classification: Studio flat)

IMPORTANT: Detect listing type (REQUIRED):
- "for sale", "to buy", "buy", "purchase", "buying" -> Add: "_listingType": "sale"
- "to rent", "rental", "rent", "renting", "let", "to let" -> Add: "_listingType": "rental"
- If no listing type mentioned -> Add: "_listingType": "both" (search both sale and rental)

LISTING TYPE EXAMPLES:
- "3 bedroom house for sale" -> {"numberBedrooms": 3, "type": {"name": "House"}, "_listingType": "sale"}
- "flat to rent in Cardiff" -> {"type": {"name": "Flat"}, "_listingType": "rental"}
- "3 bedroom house" -> {"numberBedrooms": 3, "type": {"name": "House"}, "_listingType": "both"}

IMPORTANT: Extract price ranges (OPTIONAL):
- For sales: "under £200k", "under £200000", "under 200k", "below £300000" -> Add: "_maxPrice": 200000
- For sales: "over £500k", "above £500000", "more than 500k" -> Add: "_minPrice": 500000
- For sales: "between £200k and £400k", "£200k-£400k" -> Add: "_minPrice": 200000, "_maxPrice": 400000
- For rentals: "under £1000 per month", "under £1000 pcm", "under £1000/month" -> Add: "_maxPrice": 1000
- For rentals: "over £800 per month", "above £800 pcm" -> Add: "_minPrice": 800
- For rentals: "between £800-£1200 per month" -> Add: "_minPrice": 800, "_maxPrice": 1200
- For rentals: "under £250 per week", "under £250 pw" -> Add: "_maxPrice": 1083 (converted to monthly)
- For rentals: "over £200 per week", "above £200 pw" -> Add: "_minPrice": 867 (converted to monthly)

PRICE CONVERSION NOTES:
- Convert weekly rental prices to monthly: weekly * 52 / 12 = monthly
- Sales prices in k = thousands (£200k = £200000)
- All prices stored as numbers without currency symbols

PRICE EXAMPLES:
- "house for sale under £300k" -> {"type": {"name": "House"}, "_listingType": "sale", "_maxPrice": 300000}
- "flat to rent under £1000 per month" -> {"type": {"name": "Flat"}, "_listingType": "rental", "_maxPrice": 1000}
- "3 bed house for sale over £400000" -> {"numberBedrooms": 3, "type": {"name": "House"}, "_listingType": "sale", "_minPrice": 400000}
- "rental property under £250 per week" -> {"_listingType": "rental", "_maxPrice": 1083}

RENTAL-SPECIFIC FEATURES (only for rental listings):
Extract these features for rental properties and add them with "rental" prefix:

BILLS INCLUDED (rentalListing.isBillsIncluded):
- "bills included", "all bills included", "including bills" -> Add: "_rentalBillsIncluded": true
- "bills excluded", "excluding bills", "bills not included" -> Add: "_rentalBillsIncluded": false

FURNISHED STATUS (rentalListing.furnishedStatus):
- "furnished", "fully furnished" -> Add: "_rentalFurnishedStatus": "FURNISHED"
- "unfurnished", "not furnished" -> Add: "_rentalFurnishedStatus": "UNFURNISHED"
- "part furnished", "partly furnished", "semi furnished" -> Add: "_rentalFurnishedStatus": "PART_FURNISHED"

RENTAL AVAILABILITY (rentalListing.availabilityStatus):
- "available now", "available immediately", "ready to move in" -> Add: "_rentalAvailability": "AVAILABLE"
- "let agreed", "agreed" -> Add: "_rentalAvailability": "LET_AGREED"
- "let", "taken", "rented" -> Add: "_rentalAvailability": "LET"

RENTAL EXAMPLES:
- "furnished flat to rent" -> {"type": {"name": "Flat"}, "_listingType": "rental", "_rentalFurnishedStatus": "FURNISHED"}
- "unfurnished house with bills included" -> {"type": {"name": "House"}, "_listingType": "rental", "_rentalFurnishedStatus": "UNFURNISHED", "_rentalBillsIncluded": true}
- "available rental property" -> {"_listingType": "rental", "_rentalAvailability": "AVAILABLE"}

SALE-SPECIFIC FEATURES (only for sale listings):
Extract these features for sale properties and add them with "sale" prefix:

OWNERSHIP TYPE (saleListing.ownershipType):
- "full ownership" -> Add: "_saleOwnershipType": "FULL_OWNERSHIP"
- "partial ownership" -> Add: "_saleOwnershipType": "PARTIAL_OWNERSHIP"
- "shared ownership" -> Add: "_saleOwnershipType": "SHARED_OWNERSHIP"
- "joint ownership" -> Add: "_saleOwnershipType": "JOINT_OWNERSHIP"

TENURE TYPE (saleListing.tenureType):
- "freehold" -> Add: "_saleTenureType": "FREEHOLD"
- "leasehold" -> Add: "_saleTenureType": "LEASEHOLD"
- "commonhold" -> Add: "_saleTenureType": "COMMONHOLD"
- "share of freehold" -> Add: "_saleTenureType": "SHARE_OF_FREEHOLD"

SALE PRICE TYPE (saleListing.priceType):
- "fixed price", "asking price" -> Add: "_salePriceType": "FIXED"
- "offers over", "oiro" -> Add: "_salePriceType": "OFFERS_OVER"
- "guide price", "guide" -> Add: "_salePriceType": "GUIDE_PRICE"

SALE AVAILABILITY (saleListing.availabilityStatus):
- "available", "for sale" -> Add: "_saleAvailability": "AVAILABLE"
- "under offer", "stc", "subject to contract" -> Add: "_saleAvailability": "UNDER_OFFER"
- "sold", "completion" -> Add: "_saleAvailability": "SOLD"

CHAIN STATUS (saleListing.chain):
- "chain free", "no chain", "no onward chain" -> Add: "_saleChainFree": true
- "chain", "part of chain" -> Add: "_saleChainFree": false

SALE EXAMPLES:
- "freehold house for sale" -> {"type": {"name": "House"}, "_listingType": "sale", "_saleTenureType": "FREEHOLD"}
- "chain free property" -> {"_listingType": "sale", "_saleChainFree": true}
- "shared ownership flat" -> {"type": {"name": "Flat"}, "_listingType": "sale", "_saleOwnershipType": "SHARED_OWNERSHIP"}
- "leasehold property under offer" -> {"_listingType": "sale", "_saleTenureType": "LEASEHOLD", "_saleAvailability": "UNDER_OFFER"}

Examples:
"3 bedroom house" -> {"numberBedrooms": 3, "type": {"name": "House"}}
"3 bed house in Cardiff" -> {"numberBedrooms": 3, "type": {"name": "House"}}
"detached house with garage and CCTV" -> {"type": {"name": "House"}, "classification": {"name": "Detached"}, "parking": {"garage": true}, "securityFeatures": {"cctv": true}}
"pet friendly apartment with pool and gym" -> {"type": {"name": "Flat"}, "additionalFeatures": {"petFriendly": true, "pool": true, "gym": true}}
"house with modern kitchen and breakfast bar" -> {"type": {"name": "House"}, "kitchenFeatures": {"modern": true, "breakfastBar": true}}
"wheelchair accessible flat with elevator and wet room" -> {"type": {"name": "Flat"}, "accessibilityFeatures": {"wheelchairFriendly": true, "elevator": true, "wetRoom": true}}
"house with solar panels and EV charging" -> {"type": {"name": "House"}, "energyAndUtilities": {"renewables": {"has": "SOLAR_PV"}}, "parking": {"evCharging": true}}
"property with garden office and summer house" -> {"outdoorSpace": {"gardenOffice": true, "summerHouse": true}}
"house near train station and school" -> {"type": {"name": "House"}, "amenities": {"some": {"type": "TRANSPORT", "subtype": "TRAIN_STATION"}}}
"flat close to shops and restaurants" -> {"type": {"name": "Flat"}, "amenities": {"some": {"type": "SHOPPING_ENTERTAINMENT", "subtype": "SHOP"}}}
"property with council tax band A" -> {"runningCosts": {"councilTaxBand": "A"}}
"house with low service charges" -> {"type": {"name": "House"}, "runningCosts": {"serviceCharges": {"lt": 200}}}
"house with en-suite bedroom" -> {"type": {"name": "House"}, "bedroomFeatures": {"some": {"enSuite": true}}}
"property with washing machine" -> {"utility": {"appliances": {"has": "Washing Machine"}}}
"house with gas central heating" -> {"type": {"name": "House"}, "energyAndUtilities": {"primaryHeatingType": {"has": "GAS_CENTRAL"}}}

Return ONLY the JSON object, no other text.
`;

    // Get AI to generate the WHERE clause
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: schemaPrompt },
        { role: "user", content: `Convert this search query to Prisma WHERE conditions: "${query}"` },
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

    console.log(`AI generated conditions: ${aiResponse}`);

    // Clean up the AI response - remove markdown code blocks if present
    let cleanedResponse = aiResponse;
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let whereConditions;
    try {
      whereConditions = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", aiResponse);
      console.error("Cleaned response:", cleanedResponse);
      console.error("Parse error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid search conditions generated. AI response: ${aiResponse}`,
      });
    }

    // Extract listing type preference
    const listingType = whereConditions._listingType || "both";
    delete whereConditions._listingType; // Remove from property conditions

    // Extract price range preferences
    const minPrice = whereConditions._minPrice;
    const maxPrice = whereConditions._maxPrice;
    delete whereConditions._minPrice;
    delete whereConditions._maxPrice;

    // Extract rental-specific features
    const rentalBillsIncluded = whereConditions._rentalBillsIncluded;
    const rentalFurnishedStatus = whereConditions._rentalFurnishedStatus;
    const rentalAvailability = whereConditions._rentalAvailability;
    delete whereConditions._rentalBillsIncluded;
    delete whereConditions._rentalFurnishedStatus;
    delete whereConditions._rentalAvailability;

    // Extract sale-specific features
    const saleOwnershipType = whereConditions._saleOwnershipType;
    const saleTenureType = whereConditions._saleTenureType;
    const salePriceType = whereConditions._salePriceType;
    const saleAvailability = whereConditions._saleAvailability;
    const saleChainFree = whereConditions._saleChainFree;
    delete whereConditions._saleOwnershipType;
    delete whereConditions._saleTenureType;
    delete whereConditions._salePriceType;
    delete whereConditions._saleAvailability;
    delete whereConditions._saleChainFree;

    console.log(`Detected listing type: ${listingType}`);
    if (minPrice !== undefined || maxPrice !== undefined) {
      console.log(`Detected price range: min=${minPrice}, max=${maxPrice}`);
    }
    if (rentalBillsIncluded !== undefined || rentalFurnishedStatus || rentalAvailability) {
      console.log(`Detected rental features: bills=${rentalBillsIncluded}, furnished=${rentalFurnishedStatus}, availability=${rentalAvailability}`);
    }
    if (saleOwnershipType || saleTenureType || salePriceType || saleAvailability || saleChainFree !== undefined) {
      console.log(`Detected sale features: ownership=${saleOwnershipType}, tenure=${saleTenureType}, priceType=${salePriceType}, availability=${saleAvailability}, chainFree=${saleChainFree}`);
    }

    // Execute the search with AI-generated conditions
    const whereClause: any = {
      published: true,
      property: whereConditions,
    };

    // Add price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: any = {};
      if (minPrice !== undefined) {
        priceFilter.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceFilter.lte = maxPrice;
      }
      whereClause.price = priceFilter;
    }

    // Add location filtering if we have property IDs
    if (propertyIds !== null) {
      if (propertyIds.length === 0) {
        // No properties found in location - return empty results
        return {
          results: [],
          query,
          generatedConditions: whereConditions,
          locationContext,
          detectedListingType: listingType,
          detectedPriceRange:
            minPrice !== undefined || maxPrice !== undefined
              ? {
                  minPrice,
                  maxPrice,
                }
              : undefined,
          detectedRentalFeatures:
            rentalBillsIncluded !== undefined || rentalFurnishedStatus || rentalAvailability
              ? {
                  billsIncluded: rentalBillsIncluded,
                  furnishedStatus: rentalFurnishedStatus,
                  availabilityStatus: rentalAvailability,
                }
              : undefined,
          detectedSaleFeatures:
            saleOwnershipType || saleTenureType || salePriceType || saleAvailability || saleChainFree !== undefined
              ? {
                  ownershipType: saleOwnershipType,
                  tenureType: saleTenureType,
                  priceType: salePriceType,
                  availabilityStatus: saleAvailability,
                  chainFree: saleChainFree,
                }
              : undefined,
          count: 0,
          searchType: "rag_sql",
        };
      }
      whereClause.property.id = { in: propertyIds };
    }

    // Add listing type filtering with specific features
    if (listingType === "sale") {
      const saleFilter: any = { isNot: null };

      // Add sale-specific filters
      if (saleOwnershipType) {
        // Ensure the value is a valid enum
        if (Object.values(OwnershipType).includes(saleOwnershipType as OwnershipType)) {
          saleFilter.ownershipType = saleOwnershipType as OwnershipType;
        }
      }

      if (saleTenureType) {
        // Ensure the value is a valid enum
        if (Object.values(TenureType).includes(saleTenureType as TenureType)) {
          saleFilter.tenureType = saleTenureType as TenureType;
        }
      }

      if (salePriceType) {
        // Ensure the value is a valid enum
        if (Object.values(SalePriceType).includes(salePriceType as SalePriceType)) {
          saleFilter.priceType = salePriceType as SalePriceType;
        }
      }

      if (saleAvailability) {
        // Ensure the value is a valid enum
        if (Object.values(SaleAvailabilityStatus).includes(saleAvailability as SaleAvailabilityStatus)) {
          saleFilter.availabilityStatus = saleAvailability as SaleAvailabilityStatus;
        }
      }

      if (saleChainFree !== undefined) {
        saleFilter.chain = !saleChainFree; // Note: chain=true means NOT chain free
      }

      whereClause.saleListing = saleFilter;
    } else if (listingType === "rental") {
      const rentalFilter: any = { isNot: null };

      // Add rental-specific filters
      if (rentalBillsIncluded !== undefined) {
        rentalFilter.isBillsIncluded = rentalBillsIncluded;
      }

      if (rentalFurnishedStatus) {
        // Ensure the value is a valid enum
        if (Object.values(FurnishedStatus).includes(rentalFurnishedStatus as FurnishedStatus)) {
          rentalFilter.furnishedStatus = rentalFurnishedStatus as FurnishedStatus;
        }
      }

      if (rentalAvailability) {
        // Ensure the value is a valid enum
        if (Object.values(RentalAvailabilityStatus).includes(rentalAvailability as RentalAvailabilityStatus)) {
          rentalFilter.availabilityStatus = rentalAvailability as RentalAvailabilityStatus;
        }
      }

      whereClause.rentalListing = rentalFilter;
    } else if (listingType === "both") {
      // For 'both', we need complex OR logic only if we have specific filters
      const hasRentalFilters = rentalBillsIncluded !== undefined || rentalFurnishedStatus || rentalAvailability;
      const hasSaleFilters = saleOwnershipType || saleTenureType || salePriceType || saleAvailability || saleChainFree !== undefined;

      if (hasRentalFilters || hasSaleFilters) {
        const orClauses: any[] = [];

        // Add sale clause
        if (hasSaleFilters) {
          const saleFilter: any = { isNot: null };

          if (saleOwnershipType) {
            if (Object.values(OwnershipType).includes(saleOwnershipType as OwnershipType)) {
              saleFilter.ownershipType = saleOwnershipType as OwnershipType;
            }
          }

          if (saleTenureType) {
            if (Object.values(TenureType).includes(saleTenureType as TenureType)) {
              saleFilter.tenureType = saleTenureType as TenureType;
            }
          }

          if (salePriceType) {
            if (Object.values(SalePriceType).includes(salePriceType as SalePriceType)) {
              saleFilter.priceType = salePriceType as SalePriceType;
            }
          }

          if (saleAvailability) {
            if (Object.values(SaleAvailabilityStatus).includes(saleAvailability as SaleAvailabilityStatus)) {
              saleFilter.availabilityStatus = saleAvailability as SaleAvailabilityStatus;
            }
          }

          if (saleChainFree !== undefined) {
            saleFilter.chain = !saleChainFree;
          }

          orClauses.push({ saleListing: saleFilter });
        } else {
          // No sale filters, just include any sale listing
          orClauses.push({ saleListing: { isNot: null } });
        }

        // Add rental clause
        if (hasRentalFilters) {
          const rentalFilter: any = { isNot: null };

          if (rentalBillsIncluded !== undefined) {
            rentalFilter.isBillsIncluded = rentalBillsIncluded;
          }

          if (rentalFurnishedStatus) {
            if (Object.values(FurnishedStatus).includes(rentalFurnishedStatus as FurnishedStatus)) {
              rentalFilter.furnishedStatus = rentalFurnishedStatus as FurnishedStatus;
            }
          }

          if (rentalAvailability) {
            if (Object.values(RentalAvailabilityStatus).includes(rentalAvailability as RentalAvailabilityStatus)) {
              rentalFilter.availabilityStatus = rentalAvailability as RentalAvailabilityStatus;
            }
          }

          orClauses.push({ rentalListing: rentalFilter });
        } else {
          // No rental filters, just include any rental listing
          orClauses.push({ rentalListing: { isNot: null } });
        }

        whereClause.OR = orClauses;
      }
      // If no specific filters for 'both', don't add any listing type filter (include both)
    }

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
      generatedConditions: whereConditions,
      locationContext,
      detectedListingType: listingType,
      detectedPriceRange:
        minPrice !== undefined || maxPrice !== undefined
          ? {
              minPrice,
              maxPrice,
            }
          : undefined,
      detectedRentalFeatures:
        rentalBillsIncluded !== undefined || rentalFurnishedStatus || rentalAvailability
          ? {
              billsIncluded: rentalBillsIncluded,
              furnishedStatus: rentalFurnishedStatus,
              availabilityStatus: rentalAvailability,
            }
          : undefined,
      detectedSaleFeatures:
        saleOwnershipType || saleTenureType || salePriceType || saleAvailability || saleChainFree !== undefined
          ? {
              ownershipType: saleOwnershipType,
              tenureType: saleTenureType,
              priceType: salePriceType,
              availabilityStatus: saleAvailability,
              chainFree: saleChainFree,
            }
          : undefined,
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
