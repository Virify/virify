import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a Prisma WHERE clause from natural language query using OpenAI
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

  const schemaPrompt = getPrismaSchemaPrompt();
  
  // Build the user message - don't include property constraints in the AI prompt
  let userMessage = `Convert this search query to a complete Prisma WHERE clause: "${query}"`;
  
  // Note: propertyIds will be handled separately in the API layer

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: schemaPrompt },
      { role: "user", content: userMessage },
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

  console.log(`AI generated response: ${aiResponse}`);

  // Clean up the AI response - more robust JSON extraction
  let cleanedResponse = aiResponse.trim();
  
  // Remove markdown code blocks
  if (cleanedResponse.startsWith("```json")) {
    cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```.*$/s, "");
  } else if (cleanedResponse.startsWith("```")) {
    cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```.*$/s, "");
  }
  
  // Extract just the JSON object - find the first { and matching }
  const firstBraceIndex = cleanedResponse.indexOf('{');
  if (firstBraceIndex !== -1) {
    let braceCount = 0;
    let jsonEndIndex = firstBraceIndex;
    
    for (let i = firstBraceIndex; i < cleanedResponse.length; i++) {
      if (cleanedResponse[i] === '{') braceCount++;
      if (cleanedResponse[i] === '}') braceCount--;
      if (braceCount === 0) {
        jsonEndIndex = i;
        break;
      }
    }
    
    cleanedResponse = cleanedResponse.substring(firstBraceIndex, jsonEndIndex + 1);
  }
  
  // Remove JSON comments (both // and /* */ style)
  cleanedResponse = cleanedResponse.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Clean up any trailing commas that might be left after removing comments
  cleanedResponse = cleanedResponse.replace(/,(\s*[}\]])/g, '$1');

  let parsedResponse: any = {};
  try {
    parsedResponse = JSON.parse(cleanedResponse);
    console.log("Parsed AI response:", JSON.stringify(parsedResponse, null, 2));
  } catch (error) {
    console.error("Failed to parse AI response:", aiResponse);
    console.error("Cleaned response:", cleanedResponse);
    console.error("Parse error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Invalid response generated. AI response: ${aiResponse.substring(0, 500)}...`,
    });
  }

  // Validate response structure and extract whereClause
  let whereClause: any = {};
  let queryAnalysis = {
    usedTerms: [] as string[],
    ignoredTerms: [] as string[],
  };

  // Check if response has the expected structure
  if (parsedResponse && typeof parsedResponse === 'object') {
    if (parsedResponse.whereClause && parsedResponse.queryAnalysis) {
      // New format with query analysis - this is the expected format
      whereClause = parsedResponse.whereClause;
      queryAnalysis = parsedResponse.queryAnalysis;
      console.log("Using structured response format");
    } else if (parsedResponse.published !== undefined || parsedResponse.property !== undefined) {
      // Old format - the response IS the WHERE clause
      whereClause = parsedResponse;
      console.log("Using legacy direct WHERE clause format");
    } else {
      // Invalid format
      console.error("Invalid AI response structure:", parsedResponse);
      throw createError({
        statusCode: 500,
        statusMessage: "AI returned invalid response structure",
      });
    }
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: "AI response is not a valid object",
    });
  }

  // Ensure the basic structure is correct
  if (!whereClause.published) {
    whereClause.published = true;
  }

  // Validate that whereClause is actually a valid Prisma WHERE clause
  if (typeof whereClause !== 'object' || Array.isArray(whereClause)) {
    console.error("Invalid whereClause type:", typeof whereClause, whereClause);
    throw createError({
      statusCode: 500,
      statusMessage: "AI generated invalid WHERE clause structure",
    });
  }

  console.log("Final whereClause being returned:", JSON.stringify(whereClause, null, 2));
  console.log("Final queryAnalysis being returned:", JSON.stringify(queryAnalysis, null, 2));

  return { whereClause, queryAnalysis };
}

/**
 * Get the comprehensive Prisma schema prompt for AI
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
