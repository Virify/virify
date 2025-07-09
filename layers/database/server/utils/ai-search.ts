import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Checks if the required AI configuration is present.
 */
export function checkAiConfiguration() {
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: "AI search is not configured. Please contact support.",
    });
  }
}

/**
 * Constructs the Prisma WHERE clause from the query and location filters.
 */
export async function constructPrismaWhereClause(query: string, propertyIds: number[] | null) {
  const { whereClause, queryAnalysis } = await generateWhereClauseFromQuery(query);

  if (propertyIds !== null) {
    if (propertyIds.length === 0) {
      // If no properties are in the area, we can short-circuit
      return { whereClause: { property: { id: { in: [] } } }, queryAnalysis };
    }
    if (!whereClause.property) {
      whereClause.property = {};
    }
    whereClause.property.id = { in: propertyIds };
  }

  return { whereClause, queryAnalysis };
}

/**
 * Fetches a completion from the OpenAI API for a given search query.
 * @param query The user's natural language search query.
 * @returns The AI's response as a string.
 */
async function getAiSearchCompletion(query: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getPrismaSchemaPrompt() },
      { role: "user", content: `Convert this search query to a complete Prisma WHERE clause: "${query}"` },
    ],
    temperature: 0,
  });

  const aiResponse = completion.choices[0]?.message?.content?.trim();
  if (!aiResponse) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate search conditions from AI.",
    });
  }
  return aiResponse;
}

/**
 * Parses the AI's JSON response string.
 * @param aiResponse The raw string response from the AI.
 * @returns The parsed JSON object.
 */
function parseAiCompletion(aiResponse: string): any {
  try {
    return JSON.parse(aiResponse);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid JSON response from AI: ${aiResponse.substring(0, 200)}...`,
    });
  }
}

/**
 * Normalizes the parsed AI response to extract the where clause and query analysis,
 * and ensures the 'published' flag is set.
 * @param parsedResponse The parsed object from the AI's response.
 * @returns A structured object containing the where clause and query analysis.
 */
function normalizeWhereClause(parsedResponse: any): aiSearchResult {
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
 * Generate a Prisma WHERE clause from a natural language query using OpenAI.
 *
 * @param query - The user's natural language search query.
 * @returns An object with a valid Prisma WHERE clause and query analysis.
 * @throws 500 error if AI is not configured or response is invalid.
 */
export async function generateWhereClauseFromQuery(query: string): Promise<aiSearchResult> {
  checkAiConfiguration();
  const aiResponse = await getAiSearchCompletion(query);
  const parsedResponse = parseAiCompletion(aiResponse);
  return normalizeWhereClause(parsedResponse);
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

To filter for a single property type (e.g., a studio flat), use:
{
  "property": {
    "type": { "name": "Flat" },
    "classification": { "name": "Studio flat" }
  }
}

To filter for MULTIPLE property types (e.g., "house or flat"), you MUST use the "in" operator on the type name:
{
  "property": {
    "type": {
      "name": { "in": ["House", "Flat"] }
    }
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
- For single-value enums (e.g., broadbandType, boilerType, hotWaterSource): filter as { field: "ENUM_VALUE" } (e.g., { "broadbandType": "FTTP" })
- NEVER use { "has": ... } for single-value enums. Only use { "has": ... } for enum arrays (e.g., primaryHeatingType, renewables, connectedUtilities, bed).
- For single object relations (kitchenFeatures, outdoorSpace, etc.): you MUST use the Prisma relation filter syntax: { relationName: { is: { field: value } } } (e.g., property.outdoorSpace: { is: { rearGarden: true } })
- DO NOT use additionalFeatures as a filter in the query. The additionalFeatures relation is NOT available as a filter in the Prisma PropertyWhereInput type. Any query that attempts to filter by property.additionalFeatures will cause a FATAL ERROR and must be rejected. This includes filtering for petFriendly, homeOffice, or any other field inside additionalFeatures. These cannot be filtered directly and must be ignored in the query.
- For type/classification: use {name: "..."} (e.g., property.type: {name: "House"})
- NEVER use invented fields (e.g., garden: true is INVALID; use property.outdoorSpace.rearGarden: true)
- NEVER use "has" for object relations; only for enum arrays
- saleListing and rentalListing (and all their fields, e.g. furnished) MUST ONLY appear at the ROOT level of the query, NEVER inside property or any nested object. Any query with saleListing or rentalListing inside property is INVALID.
- Respond with ONLY valid JSON, no comments, no markdown

IMPORTANT: For every user query, you MUST return a queryAnalysis object with two arrays:
- usedTerms: all terms/phrases from the user query that were mapped to valid schema fields and used in the whereClause
- ignoredTerms: all terms/phrases from the user query that were NOT mapped to any schema field and NOT used in the whereClause (including any words, phrases, or objects not present in the schema)

You MUST parse the user query into all meaningful terms and phrases. For each, if it is not mapped to a valid schema field, add it to ignoredTerms. This includes any invented, irrelevant, or non-schema terms (e.g., 'jukebox', 'slide', 'castle', etc). This ensures the frontend can cross out all non-schema terms in the query analysis UI.

EXAMPLES:

"house with underfloor heating and smart meter and a jukebox and 2 bathrooms, one upstairs and one downstairs" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": { "name": "House" },
      "energyAndUtilities": {
        "primaryHeatingType": { "has": "UNDERFLOOR" },
        "renewables": { "has": "SMART_METER" }
      },
      "bathroomFeatures": { "some": { "roomNumber": 2, "upstairs": true, "downstairs": true } }
    }
  },
  "queryAnalysis": {
    "usedTerms": ["house", "underfloor heating", "smart meter", "2 bathrooms", "upstairs", "downstairs"],
    "ignoredTerms": ["jukebox"]
  }
}

// VALID EXAMPLE (all terms mapped):
// "3 bedroom detached house for sale" →
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

// VALID EXAMPLE (some terms ignored):
// "cottage with log burner and jukebox" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": {"name": "Cottage"},
      "livingAreaFeatures": {"fireplace": "LOG_BURNER"}
    }
  },
  "queryAnalysis": {"usedTerms": ["cottage", "log", "burner"], "ignoredTerms": ["jukebox"]}
}

// VALID EXAMPLE (no ignored terms):
// "rental under £2000" →
{
  "whereClause": {
    "published": true,
    "rentalListing": {"isNot": null},
    "price": {"lte": 2000}
  },
  "queryAnalysis": {"usedTerms": ["rental", "under", "2000"], "ignoredTerms": []}
}

// VALID EXAMPLE (multiple ignored terms):
// "house with solar panels, EV charger, and jukebox" →
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
  "queryAnalysis": {"usedTerms": ["house", "solar", "panels", "EV", "charger"], "ignoredTerms": ["jukebox"]}
}

// VALID EXAMPLE (complex query with all features):
// "bedroom with en suite and walk-in wardrobe" →
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

// VALID EXAMPLE (property features):
// "property with rear garden and driveway" →
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

// VALID EXAMPLE (flat features):
// "flat with FTTP broadband and balcony" →
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

// VALID EXAMPLE (rental features):
// "furnished flat with bills included" →
{
  "whereClause": {
    "published": true,
    "rentalListing": { "isNot": null },
    "property": {
      "type": { "name": "Flat" }
    },
    "rentalListing": { "is": { "furnishedStatus": "FURNISHED", "isBillsIncluded": true } }
  },
  "queryAnalysis": { "usedTerms": ["furnished", "flat", "bills included"], "ignoredTerms": [] }
}

// VALID EXAMPLE (reception features):
// "house with games room and home cinema" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": { "name": "House" },
      "reception": { "some": { "gamesRoom": true, "homeCinema": true } }
    }
  },
  "queryAnalysis": { "usedTerms": ["house", "games room", "home cinema"], "ignoredTerms": [] }
}

// SPECIAL MAPPING: "fast broadband" or similar phrases should NOT be mapped to broadbandType: "UNKNOWN". Instead, map as follows:
// - If the user requests "fast broadband", map to property.energyAndUtilities.fullFibreAvailable: true OR property.energyAndUtilities.maxDownloadSpeedMbps >= 100 (or another suitable threshold for fast broadband).
// - Do NOT use broadbandType: "UNKNOWN" for "fast broadband" or similar queries.
//
// EXAMPLES:
// "house with home office and fast broadband" →
// {
//   "whereClause": {
//     "published": true,
//     "property": {
//       "type": { "name": "House" },
//       "additionalFeatures": { "is": { "homeOffice": true } },
//       "energyAndUtilities": {
//         "fullFibreAvailable": true
//         // Optionally, you may also include: "maxDownloadSpeedMbps": { "gte": 100 }
//       }
//     }
//   },
//   "queryAnalysis": { "usedTerms": ["house", "home", "office", "fast", "broadband"], "ignoredTerms": [] }
// }
//
// "pet friendly house with garden" →
// {
//   "whereClause": {
//     "published": true,
//     "property": {
//       "type": { "name": "House" },
//       // petFriendly cannot be filtered directly due to Prisma limitations
//       "outdoorSpace": { "is": { "rearGarden": true } }
//     }
//   },
//   "queryAnalysis": { "usedTerms": ["pet friendly", "house", "garden"], "ignoredTerms": ["pet friendly"] }
// }
//
// "pet friendly house with gardens" →
// {
//   "whereClause": {
//     "published": true,
//     "property": {
//       "type": { "name": "House" },
//       // petFriendly cannot be filtered directly due to Prisma limitations
//       "outdoorSpace": { "is": { "frontGarden": true, "rearGarden": true } }
//     }
//   },
//   "queryAnalysis": { "usedTerms": ["pet friendly", "house", "gardens"], "ignoredTerms": ["pet friendly"] }
// }

// VALID EXAMPLE (home office):
// "house with home office" →
// {
//   "whereClause": {
//     "published": true,
//     "property": {
//       "type": { "name": "House" },
//       // homeOffice cannot be filtered directly due to Prisma limitations (if so, explain)
//       // If it can be filtered, use:
//       // "additionalFeatures": { "is": { "homeOffice": true } }
//     }
//   },
//   "queryAnalysis": { "usedTerms": ["house", "home office"], "ignoredTerms": [] }
// }

// VALID EXAMPLE (property features with parking):
// "unfurnished house with parking" →
// {
//   "whereClause": {
//     "published": true,
//     "property": {
//       "type": { "name": "House" },
//       "parking": { "is": {} } // or specify features, e.g. { "driveway": true }
//     },
//     "rentalListing": { "is": { "furnishedStatus": "UNFURNISHED" } }
//   },
//   "queryAnalysis": { "usedTerms": ["unfurnished", "house", "parking"], "ignoredTerms": [] }
// }

// IMPORTANT: For every user query, if a phrase from the user query is mapped to a schema field and used in the whereClause, you MUST include the exact phrase (as it appears in the user query) in usedTerms. Do not split or omit multi-word phrases. Always use the full phrase from the query if it was mapped and used.
`;
}
