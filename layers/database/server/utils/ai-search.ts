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
    console.error("Failed to parse AI response:", aiResponse, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid JSON response from AI: ${aiResponse.substring(0, 200)}...`,
      message: `Failed to parse AI response: ${error instanceof Error ? error.message : String(error)}`,
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
CRITICAL: NEVER add Comments or quotes or markdown formatting to the AI response. The response MUST be a valid JSON object with a "whereClause" and "queryAnalysis" field. Any comments, quotes, or markdown will cause a FATAL ERROR.
NEVER DO THIS: "size": { "gte": 1000 } // Assuming "large" refers to a size greater than 1000 square meters - the quotes around large breaks
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
- House: Terraced, Semi-detached, End of Terrace, Detached, Mansion
- Cottage: Terraced, Detached, Semi-detached, End of Terrace
- Bungalow: Terraced, Semi-detached, End of Terrace, Detached
- Flat: Converted, Studio, Maisonette, High-rise, Within a Complex, Penthouse
- Land: Residential, Commercial, Agricultural, Development Plot, Development Potential
- Farms: Non-working Farmhouse, Working, Small Holding
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
- title: String (listing title)
- description: String (listing description)
- moveInDate: DateTime (for rentals)
- saleListing: {isNot: null} for sales only (ROOT LEVEL)
- rentalListing: {isNot: null} for rentals only (ROOT LEVEL)
- property: {...} (all property features below)

SALE LISTING FIELDS (saleListing, root level only):
- id: Int
- tenureType: "FREEHOLD"|"LEASEHOLD"|"COMMONHOLD"
- chain: Boolean
- sharedOwnership: Boolean
- auction: Boolean
- priceType: "FIXED"|"OFFER_OVER"|"GUIDE_PRICE"
- availabilityStatus: "FOR_SALE"|"UNDER_OFFER"|"SOLD"

RENTAL LISTING FIELDS (rentalListing, root level only):
- id: Int
- availabilityStatus: "AVAILABLE"|"LET_AGREED"|"LET"
- furnishedStatus: "FURNISHED"|"PART_FURNISHED"|"UNFURNISHED"
- isBillsIncluded: Boolean
- deposit: Float
- holdingDeposit: Float
- rentFrequency: "WEEKLY"|"MONTHLY"
- rentalLength: Int
- availabilityStatus: "AVAILABLE"|"LET_AGREED"|"LET"

PROPERTY FIELDS (under property):
- numberBedrooms: Int
- numberBathrooms: Int
- numberReceptions: Int
- numberOtherRooms: Int
- size: Float
- value: Float
- yearBuilt: String
- vacant: Boolean
- constructionType: "STANDARD"|"NON_STANDARD"
- floorLevel: Int
- totalFloors: Int
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

bedroomFeatures (property.bedroomFeatures): ARRAY (use {some: {...}})
- roomNumber: Int
- name: String
- floor: Int
- bed: ["SINGLE"|"DOUBLE"|"QUEEN"|"KING"|"SUPER_KING"] (enum array)
- enSuite: Boolean
- builtInStorage: Boolean
- walkInWardrobe: Boolean
- bayWindow: Boolean
- balcony: Boolean
- hasView: Boolean
- patioDoors: Boolean
- builtInDesk: Boolean
- description: String
- size: Float

bathroomFeatures (property.bathroomFeatures): ARRAY (use {some: {...}})
- roomNumber: Int
- floor: Int
- name: String
- enSuite: Boolean
- bathtub: Boolean
- walkInShower: Boolean
- toilet: Boolean
- description: String
- size: Float

reception (property.reception): ARRAY (use {some: {...}})
- roomNumber: Int
- floor: Int
- name: String
- type: "LIVING_ROOM"|"FAMILY_ROOM"|"DINING_ROOM"|"GAMES_ROOM"|"HOME_CINEMA"
- description: String
- size: Float
- conservatory: Boolean
- openPlan: Boolean
- openConcept: Boolean
- fireplace: "LOG_BURNER"|"OPEN_FIRE"|null
- balcony: Boolean
- bayWindow: Boolean
- builtInShelving: Boolean
- hasView: Boolean
- patioDoors: Boolean
- builtInStorage: Boolean
- servingHatch: Boolean
- barArea: Boolean
- soundProofing: Boolean
- accousticPanels: Boolean
- stoneFlooring: Boolean
- hardwoodFlooring: Boolean
- builtInDesk: Boolean

otherRoom (property.otherRoom): ARRAY (use {some: {...}})
- roomNumber: Int
- floor: Int
- name: String
- type: "OFFICE"|"STUDY"|"LIBRARY"|"GYM"|"WORKSHOP"|"POOL_ROOM"|"WINE_CELLAR"|"SPA"|"OTHER"
- description: String
- size: Float
- openPlan: Boolean
- openConcept: Boolean
- fireplace: "LOG_BURNER"|"OPEN_FIRE"|null
- balcony: Boolean
- bayWindow: Boolean
- builtInShelving: Boolean
- hasView: Boolean
- patioDoors: Boolean
- builtInStorage: Boolean
- servingHatch: Boolean
- barArea: Boolean
- soundProofing: Boolean
- accousticPanels: Boolean
- stoneFlooring: Boolean
- hardwoodFlooring: Boolean
- builtInDesk: Boolean

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
- totalSize: Float

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
- pool: Boolean
- internet: Boolean
- concierge: Boolean
- shop: Boolean
- gym: Boolean
- description: String

utility (property.utility):
- storage: Boolean
- sink: Boolean
- plumbing: Boolean
- description: String
- size: Float

storageFeatures (property.storageFeatures):
- attic: Boolean
- basement: Boolean
- separateDressing: Boolean
- underStairsStorage: Boolean
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

amenities (property.amenities):
- type: "TRANSPORT"|"EDUCATION"|"HEALTHCARE"
- subtype: "TRAIN_STATION"|"SCHOOL"|"UNIVERSITY"|"HOSPITAL"
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
- Receptions have different types (e.g., living room, family room, dining room, games room, home cinema) and can be filtered by type or features like balcony, fireplace, etc. Use the exact type names as defined in the schema.
- Other rooms (otherRoom) include office spaces, studies, libraries, gyms, workshops, pool rooms, wine cellars, spas, etc. Use otherRoom for office-related queries (home office, study, etc.).

COMMON USER TERM MAPPINGS (map these user terms to correct schema fields):
- "conservatory" → property.reception: { some: { conservatory: true } }
- "bay window" → property.reception: { some: { bayWindow: true } } OR property.otherRoom: { some: { bayWindow: true } } OR property.bedroomFeatures: { some: { bayWindow: true } }
- "built-in storage" → property.reception: { some: { builtInStorage: true } } OR property.otherRoom: { some: { builtInStorage: true } } OR property.bedroomFeatures: { some: { builtInStorage: true } }
- "hardwood floors" → property.reception: { some: { hardwoodFlooring: true } } OR property.otherRoom: { some: { hardwoodFlooring: true } }
- "stone floors" → property.reception: { some: { stoneFlooring: true } } OR property.otherRoom: { some: { stoneFlooring: true } }
- "sound proofing" → property.reception: { some: { soundProofing: true } } OR property.otherRoom: { some: { soundProofing: true } }
- "acoustic panels" → property.reception: { some: { accousticPanels: true } } OR property.otherRoom: { some: { accousticPanels: true } }
- "patio doors" → property.reception: { some: { patioDoors: true } } OR property.otherRoom: { some: { patioDoors: true } } OR property.bedroomFeatures: { some: { patioDoors: true } }
- "serving hatch" → property.reception: { some: { servingHatch: true } } OR property.otherRoom: { some: { servingHatch: true } }
- "bar area" → property.reception: { some: { barArea: true } } OR property.otherRoom: { some: { barArea: true } }
- "built-in desk" → property.reception: { some: { builtInDesk: true } } OR property.otherRoom: { some: { builtInDesk: true } } OR property.bedroomFeatures: { some: { builtInDesk: true } }
- "balcony" → property.reception: { some: { balcony: true } } OR property.otherRoom: { some: { balcony: true } } OR property.bedroomFeatures: { some: { balcony: true } }
- "has view" → property.reception: { some: { hasView: true } } OR property.otherRoom: { some: { hasView: true } } OR property.bedroomFeatures: { some: { hasView: true } }
- "wine cellar" → property.otherRoom: { some: { type: "WINE_CELLAR" } }
- "home gym" → property.otherRoom: { some: { type: "GYM" } }
- "workshop" → property.otherRoom: { some: { type: "WORKSHOP" } }
- "library" → property.otherRoom: { some: { type: "LIBRARY" } }
- "spa room" → property.otherRoom: { some: { type: "SPA" } }

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
      "OR": [
        { "reception": { "some": { "type": "GAMES_ROOM" } } },
        { "reception": { "some": { "type": "HOME_CINEMA" } } }
      ]
    }
  },
  "queryAnalysis": { "usedTerms": ["house", "games room", "home cinema"], "ignoredTerms": [] }
}

// VALID EXAMPLE (conservatory):
// "property with conservatory and hardwood floors" →
{
  "whereClause": {
    "published": true,
    "property": {
      "reception": { 
        "some": { 
          "conservatory": true,
          "hardwoodFlooring": true
        } 
      }
    }
  },
  "queryAnalysis": { "usedTerms": ["conservatory", "hardwood floors"], "ignoredTerms": [] }
}

IMPORTANT: For queries like "property with additional toilet", you MUST filter for properties where more than one bathroom has a toilet. Prisma cannot directly count array elements in the where clause, but you should use:
  { "property": { "bathroomFeatures": { "some": { "toilet": true } } } }
This will match any property with at least one bathroom with a toilet. For "additional toilet", "second toilet", or "more than one toilet", you should explain in the queryAnalysis that this is a limitation and the filter will match any property with at least one bathroom with a toilet.

EXAMPLES:
// "property with additional toilet" →
{
  "whereClause": {
    "published": true,
    "property": {
      "bathroomFeatures": { "some": { "toilet": true } }
    }
  },
  "queryAnalysis": {
    "usedTerms": ["additional toilet"],
    "ignoredTerms": [],
    "notes": ["Prisma cannot directly filter for more than one bathroom with a toilet; this filter matches any property with at least one bathroom with a toilet."]
  }
}

IMPORTANT: When the user requests a "home office", "office room", or similar, you MUST map this to an otherRoom with type "OFFICE". Use:
  { "property": { "otherRoom": { "some": { "type": "OFFICE" } } } }
If the schema also supports an additionalFeatures.homeOffice boolean, you MAY also include:
  { "property": { "additionalFeatures": { "is": { "homeOffice": true } } } }
But the primary mapping for "home office" or "office room" is always an otherRoom with type "OFFICE".

EXAMPLES:
// "property with home office" →
{
  "whereClause": {
    "published": true,
    "property": {
      "otherRoom": { "some": { "type": "OFFICE" } }
    }
  },
  "queryAnalysis": { "usedTerms": ["home office"], "ignoredTerms": [] }
}

// "house with office" →
{
  "whereClause": {
    "published": true,
    "property": {
      "type": { "name": "House" },
      "otherRoom": { "some": { "type": "OFFICE" } }
    }
  },
  "queryAnalysis": { "usedTerms": ["house", "office"], "ignoredTerms": [] }
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
