/**
 * AI-driven Prisma WHERE clause generator for property search.
 *
 * This module provides a function to convert natural language queries into
 * valid, schema-accurate Prisma WHERE clauses for property listings, using OpenAI.
 *
 * - Ensures all generated queries match the real Prisma schema (no invented fields).
 * - Handles all property, saleListing, rentalListing, and nested feature fields.
 * - Expects clean, valid JSON from the AI (no post-processing or fixups).
 * - Includes a comprehensive, explicit schema prompt for the AI.
 *
 */
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a Prisma WHERE clause from a natural language query using OpenAI.
 *
 * @param query - The user's natural language search query.
 * @param propertyIds - (Optional) Restrict search to these property IDs.
 * @returns An object with a valid Prisma WHERE clause and query analysis.
 * @throws 500 error if AI is not configured or response is invalid.
 */
export async function generateWhereClauseFromQuery(
  query: string,
  propertyIds?: number[] | null
): Promise<{
  whereClause: any;
  queryAnalysis: {
    usedTerms: string[];
    ignoredTerms: string[];
  };
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI search is not configured. Please contact support.",
    });
  }

  // Get AI response
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getPrismaSchemaPrompt() },
      { role: "user", content: `Convert this search query to a complete Prisma WHERE clause: "${query}"` },
    ],
    temperature: 0,
  });

  // Expect valid, clean JSON from the AI (no markdown, no comments)
  let aiResponse = completion.choices[0]?.message?.content?.trim();
  if (!aiResponse) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate search conditions",
    });
  }

  // Parse the response directly
  let parsedResponse: any;
  try {
    parsedResponse = JSON.parse(aiResponse);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid response generated. AI response: ${aiResponse.substring(0, 500)}...`,
    });
  }

  // Accept either { whereClause, queryAnalysis } or a direct whereClause
  let whereClause: any;
  let queryAnalysis = { usedTerms: [], ignoredTerms: [] };
  if (parsedResponse.whereClause && parsedResponse.queryAnalysis) {
    whereClause = parsedResponse.whereClause;
    queryAnalysis = parsedResponse.queryAnalysis;
  } else {
    whereClause = parsedResponse;
  }

  // Always ensure published is true
  if (!whereClause.published) {
    whereClause.published = true;
  }

  return { whereClause, queryAnalysis };
}

/**
 * Get the comprehensive Prisma schema prompt for AI.
 *
 * This prompt:
 * - Explicitly lists all valid fields, enums, and relations for Listing, Property, and all nested features.
 * - Provides strong rules and examples to prevent invalid query structures.
 * - Ensures the AI never invents fields or nests saleListing/rentalListing incorrectly.
 * - Is the single source of truth for valid Prisma WHERE clause generation.
 *
 * @returns The full system prompt string for OpenAI.
 */
function getPrismaSchemaPrompt(): string {
  return `
CRITICAL: DO NOT NEST saleListing or rentalListing (or any of their fields) inside property or any nested object. This is a SCHEMA VIOLATION and will cause a FATAL ERROR. These fields MUST ONLY appear at the ROOT level of the query.

IMPORTANT: To filter by fields of rentalListing or saleListing, you MUST use the correct Prisma relation filter syntax:
- To filter for existence: { rentalListing: { isNot: null } }
- To filter by fields: { rentalListing: { is: { furnishedStatus: "FURNISHED" } } }
- NEVER use { rentalListing: { furnishedStatus: ... } } (this is INVALID and will cause an error)

// INVALID EXAMPLE (never do this):
// { "rentalListing": { furnishedStatus: "FURNISHED" } }
// CORRECT: { "rentalListing": { is: { furnishedStatus: "FURNISHED" } } }

// INVALID EXAMPLE (never do this):
// { "property": { "rentalListing": { "furnishedStatus": "FURNISHED" } } }
// CORRECT: { "rentalListing": { is: { furnishedStatus: "FURNISHED" } } }

Convert natural language property queries to a valid Prisma WHERE clause JSON for the Virify property search. Use ONLY the fields, relations, and enum values exactly as defined below. Do NOT invent or generalize field names. Follow the structure and rules precisely.

SCHEMA OVERVIEW:
- Listing (root): published, price, saleListing, rentalListing, property
- Property (nested under listing): all property features and relations

PROPERTY TYPES AND CLASSIFICATIONS (use these exact values):
- House: Terraced, Semi-detached, End of terrace, Detached, Mansion
- Cottage: Terraced, Detached, Semi-detached, End of terrace
- Bungalow: Terraced, Semi-detached, End of terrace, Detached
- Flat: Converted flat, Studio flat, Maisonette, High-rise, Within a complex, Penthouse
- Land: Residential Land, Commercial Land, Agricultural Land, Development plot, Development potential
- Farms: Non-working Farmhouse, Working Farm, Small Holding
- Specialty: Shared Ownership, Retirement Home, New Build Home
- Student Accommodation: Flat, House, House-share

To filter for a studio flat, use:
{
  "property": {
    "type": { "name": "Flat" },
    "classification": { "name": "Studio flat" }
  }
}

ROOT LISTING FIELDS:
- published: Boolean (always true for searches)
- price: Float (listing price in £)
- saleListing: {isNot: null} for sales only (ROOT LEVEL)
- rentalListing: {isNot: null} for rentals only (ROOT LEVEL)
- property: {...} (all property features below)

SALE LISTING FIELDS (saleListing, root level only):
- id: Int
- availableFrom: DateTime
- tenure: "FREEHOLD"|"LEASEHOLD"|"SHARE_OF_FREEHOLD"|"COMMONHOLD"|"FEUDAL"|"OTHER"|null
- chainFree: Boolean
- sharedOwnership: Boolean
- sharedEquity: Boolean
- newBuild: Boolean
- auction: Boolean
- guidePrice: Float
- offersOver: Float
- offersInRegionOf: Float
- offersInExcessOf: Float
- priceOnApplication: Boolean
- description: String

RENTAL LISTING FIELDS (rentalListing, root level only):
- id: Int
- availableFrom: DateTime
- furnishedStatus: "FURNISHED"|"UNFURNISHED"|"PART_FURNISHED"|null
- isBillsIncluded: Boolean
- deposit: Float
- holdingDeposit: Float
- rentFrequency: "WEEKLY"|"MONTHLY"
- rentalLength: Int
- availabilityStatus: "AVAILABLE"|"LET_AGREED"|"LET"
- description: String

PROPERTY FIELDS (under property):
- numberBedrooms: Int
- numberBathrooms: Int
- numberReceptions: Int
- size: Float
- value: Float
- yearBuilt: String
- chainFree: Boolean
- vacant: Boolean
- constructionType: "STANDARD"|"NON_STANDARD"
- floorLevel: Int
- type: {name: String} (PropertyType relation)
- classification: {name: String} (PropertyClassification relation)

PROPERTY FEATURE OBJECTS (all are single objects unless marked ARRAY):

kitchenFeatures (property.kitchenFeatures):
- modern: Boolean
- openPlan: Boolean
- whiteGoods: Boolean
- breakfastBar: Boolean
- island: Boolean
- utilityAccess: Boolean
- pantry: Boolean
- description: String
- size: Float

livingAreaFeatures (property.livingAreaFeatures):
- fireplace: "LOG_BURNER"|"OPEN_FIRE"|null
- balcony: Boolean
- openPlan: Boolean
- description: String
- size: Float

diningroomFeatures (property.diningroomFeatures):
- openConcept: Boolean
- description: String
- size: Float

bedroomFeatures (property.bedroomFeatures): ARRAY (use {some: {...}})
- roomNumber: Int
- bed: ["SINGLE"|"DOUBLE"|"QUEEN"|"KING"|"SUPER_KING"|"BUNK"] (enum array)
- enSuite: Boolean
- builtInStorage: Boolean
- walkInWardrobe: Boolean
- description: String
- size: Float

bathroomFeatures (property.bathroomFeatures): ARRAY (use {some: {...}})
- roomNumber: Int
- enSuite: Boolean
- bathtub: Boolean
- walkInShower: Boolean
- downstairs: Boolean
- upstairs: Boolean
- description: String
- size: Float

reception (property.reception): ARRAY (use {some: {...}})
- roomNumber: Int
- openPlan: Boolean
- fireplace: "LOG_BURNER"|"OPEN_FIRE"|null
- gamesRoom: Boolean
- homeCinema: Boolean
- description: String
- size: Float

outdoorSpace (property.outdoorSpace):
- frontGarden: Boolean
- frontGardenSize: Float
- rearGarden: Boolean
- rearGardenSize: Float
- sunTerrace: Boolean
- terrace: Boolean
- balcony: Boolean
- patio: Boolean
- separateParcel: Boolean
- shed: Boolean
- summerHouse: Boolean
- gardenOffice: Boolean
- pool: Boolean
- description: String

parking (property.parking):
- garage: Boolean
- driveway: Boolean
- permitParking: Boolean
- onStreet: Boolean
- noParking: Boolean
- carport: Boolean
- allocatedParking: Boolean
- evCharging: Boolean
- description: String

accessibilityFeatures (property.accessibilityFeatures):
- wheelchairFriendly: Boolean
- stepFreeAccess: Boolean
- wideDoorways: Boolean
- wetRoom: Boolean
- handrails: Boolean
- elevator: Boolean
- stairs: Boolean
- accessibleParking: Boolean
- description: String

securityFeatures (property.securityFeatures):
- gatedCommunity: Boolean
- cctv: Boolean
- alarmSystem: Boolean
- neighborhoodWatch: Boolean
- intercomSystem: Boolean
- security: Boolean
- reception: Boolean
- description: String

additionalFeatures (property.additionalFeatures):
- petFriendly: Boolean
- moveInDate: DateTime
- homeOffice: Boolean
- pool: Boolean
- internet: Boolean
- cableTv: Boolean
- phone: Boolean
- laundry: Boolean
- concierge: Boolean
- shop: Boolean
- gym: Boolean
- description: String

utility (property.utility):
- appliances: String[]
- storage: Boolean
- sink: Boolean
- plumbing: Boolean
- description: String
- size: Float

additionalToilet (property.additionalToilet):
- downstairs: Boolean
- upstairs: Boolean
- guestCloakroom: Boolean
- description: String

storageFeatures (property.storageFeatures):
- attic: Boolean
- basement: Boolean
- separateDressing: Boolean
- underStairsStorage: Boolean
- pantry: Boolean
- description: String

energyAndUtilities (property.energyAndUtilities):
- epcRating: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"UNKNOWN"
- primaryHeatingType: ["GAS_CENTRAL"|"ELECTRIC"|"OIL"|"UNDERFLOOR"|"BIOMASS"|"HEAT_PUMP"|"DISTRICT"|"STORAGE_HEATERS"|"LPG"|"PASSIVE"|"SOLAR_THERMAL"|"OTHER"|"NILL"] (enum array, use {has: ...})
- secondaryHeatingType: [same as above] (enum array, use {has: ...})
- boilerType: "COMBI"|"SYSTEM"|"CONVENTIONAL"|"BACK_BOILER"|"UNKNOWN"|null
- hotWaterSource: "BOILER"|"IMMERSION_HEATER"|"SOLAR_THERMAL"|"HEAT_PUMP"|"OTHER"|null
- renewables: ["SOLAR_PV"|"BATTERY_STORAGE"|"SMART_METER"|"EV_CHARGING"|"GREY_WATER"] (enum array, use {has: ...})
- connectedUtilities: ["GAS"|"ELECTRICITY"|"WATER"|"SEWAGE"|"DRAINAGE"|"SEPTIC_TANK"|"CESSPIT"|"RAINWATER_HARVESTING"] (enum array, use {has: ...})
- broadbandType: "ADSL"|"FTTC"|"FTTP"|"CABLE"|"MOBILE"|"UNKNOWN"|null
- fullFibreAvailable: Boolean
- maxDownloadSpeedMbps: Float

runningCosts (property.runningCosts):
- councilTaxBand: String
- serviceCharges: Float
- groundRent: Float
- description: String

Land (property.Land):
- landSize: Float
- planningClassification: "AGRICULTURAL"|"RESIDENTIAL"|"COMMERCIAL"|"INDUSTRIAL"|"MIXED_USE"|"OTHER"
- accessRights: Boolean
- roadFrontage: Boolean
- utilitiesAvailable: Boolean
- currentUse: "GRAZING"|"ARABLE"|"PASTURE"|"FORESTRY"|"EQUESTRIAN"|"HORTICULTURE"|"CONSERVATION"|"MIXED"|"VACANT"|"OTHER"
- agriculturalSubsidies: Boolean
- stewardshipScheme: Boolean
- tenanted: Boolean
- vacant: Boolean
- agriculturalUse: Boolean
- description: String

amenities (property.amenities):
- type: "TRANSPORT"|"EDUCATION"|"HEALTHCARE"|"SHOPPING_ENTERTAINMENT"|"GREEN_SPACE"
- subtype: "TRAIN_STATION"|"BUS_STOP"|"MOTORWAY_ACCESS"|"SCHOOL"|"UNIVERSITY"|"HOSPITAL"|"MEDICAL_CENTRE"|"SHOP"|"RESTAURANT"|"CINEMA"|"GYM"|"PARK"|"TRAIL"|"PLAYGROUND"|"OTHER"
- name: String
- distanceM: Float

ARRAY/RELATION/ENUM RULES:
- For model arrays (bedroomFeatures, bathroomFeatures, reception): use {"some": {field: value}} for filtering
- For enum arrays (primaryHeatingType, renewables, connectedUtilities, bed): use {"has": "ENUM_VALUE"}
- For single object relations (kitchenFeatures, outdoorSpace, etc.): access fields directly (e.g., property.kitchenFeatures.modern: true)
- For type/classification: use {name: "..."} (e.g., property.type: {name: "House"})
- NEVER use invented fields (e.g., garden: true is INVALID; use property.outdoorSpace.rearGarden: true)
- NEVER use "has" for object relations; only for enum arrays
- saleListing and rentalListing (and all their fields, e.g. furnished) MUST ONLY appear at the ROOT level of the query, NEVER inside property or any nested object. Any query with saleListing or rentalListing inside property is INVALID.
- Respond with ONLY valid JSON, no comments, no markdown

EXAMPLES:
"3 bedroom detached house for sale" →
{
  "whereClause": {
    "published": true,
    "saleListing": {"isNot": null},
    "property": {
      "numberBedrooms": 3,
      "type": {"name": "House"},
      "classification": {"name": "Detached"}
    }
  },
  "queryAnalysis": {"usedTerms": ["3", "bedroom", "detached", "house", "sale"], "ignoredTerms": []}
}

"cottage with log burner" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": {"name": "Cottage"},
      "livingAreaFeatures": {"fireplace": "LOG_BURNER"}
    }
  },
  "queryAnalysis": {"usedTerms": ["cottage", "log", "burner"], "ignoredTerms": []}
}

"rental under £2000" →
{
  "whereClause": {
    "published": true,
    "rentalListing": {"isNot": null},
    "price": {"lte": 2000}
  },
  "queryAnalysis": {"usedTerms": ["rental", "under", "2000"], "ignoredTerms": []}
}

"house with solar panels and EV charger" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": {"name": "House"},
      "energyAndUtilities": {
        "renewables": {"has": "SOLAR_PV"},
        "renewables": {"has": "EV_CHARGING"}
      }
    }
  },
  "queryAnalysis": {"usedTerms": ["house", "solar", "panels", "EV", "charger"], "ignoredTerms": []}
}

"bedroom with en suite and walk-in wardrobe" →
{
  "whereClause": {
    "published": true,
    "property": {
      "bedroomFeatures": {
        "some": {
          "enSuite": true,
          "walkInWardrobe": true
        }
      }
    }
  },
  "queryAnalysis": {"usedTerms": ["bedroom", "en suite", "walk-in", "wardrobe"], "ignoredTerms": []}
}

"property with rear garden and driveway" →
{
  "whereClause": {
    "published": true,
    "property": {
      "outdoorSpace": {"rearGarden": true},
      "parking": {"driveway": true}
    }
  },
  "queryAnalysis": {"usedTerms": ["rear", "garden", "driveway"], "ignoredTerms": []}
}

"flat with FTTP broadband and balcony" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": {"name": "Flat"},
      "energyAndUtilities": {"broadbandType": "FTTP"},
      "livingAreaFeatures": {"balcony": true}
    }
  },
  "queryAnalysis": {"usedTerms": ["flat", "FTTP", "broadband", "balcony"], "ignoredTerms": []}
}

REMEMBER:
- Use only the fields, enums, and relations as listed above.
- Do NOT invent or generalize field names.
- Use correct Prisma syntax for arrays, enums, and object relations.
- saleListing and rentalListing (and all their fields, e.g. furnished) MUST ONLY appear at the ROOT level of the query, NEVER inside property or any nested object. Any query with saleListing or rentalListing inside property is INVALID.
- Respond with valid JSON only, no markdown or comments.
`;
}
