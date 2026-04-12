import { readFileSync } from "fs";
import { join } from "path";
import { getPropertyTypes } from "./property-type";

let cachedSchemaText: string | null = null;
let cachedPrompt: string | null = null;

/**
 * Loads the Prisma schema files and caches them as text.
 * This is called once at startup and the result is reused.
 */
function loadSchemaFiles(): string {
  if (cachedSchemaText) {
    return cachedSchemaText;
  }

  const prismaDir = join(process.cwd(), "layers/database/server/database/prisma");
  
  // Read the relevant schema files for property search
  const schemaFiles = [
    "listing/listing.prisma",
    "listing/saleListing.prisma",
    "listing/rentalListing.prisma",
    "property/property.prisma",
    "property/propertyType.prisma",
    "property/propertyClassification.prisma",
    "property/bedroom.prisma",
    "property/bathroom.prisma",
    "property/reception.prisma",
    "property/otherRoom.prisma",
    "property/kitchen.prisma",
    "property/parking.prisma",
    "property/security.prisma",
    "property/storage.prisma",
    "property/accessibility.prisma",
    "property/utility.prisma",
    "property/runningCosts.prisma",
    "property/additionalFeatures.prisma",
    "property/amenties.prisma",
    "property/energyAndUtils.prisma",
    "property/outdoor-space/outdoorSpace.prisma",
    "property/outdoor-space/garden.prisma",
    "property/outdoor-space/yard.prisma",
    "property/outdoor-space/land.prisma",
    "user/user.prisma",
  ];
  
  let schemaText = "\n\nRELEVANT PRISMA SCHEMA:\n\n";
  
  for (const file of schemaFiles) {
    const filePath = join(prismaDir, file);
    try {
      const content = readFileSync(filePath, "utf-8");
      schemaText += content + "\n";
    } catch (error: any) {
      // Skip files that don't exist
      console.warn(`Schema file not found: ${file}`);
    }
  }
  
  cachedSchemaText = schemaText;
  return schemaText;
}

/**
 * Generates a comprehensive Prisma schema prompt for AI.
 * Schema is loaded once and cached for the lifetime of the process.
 */
export async function getPrismaSchemaPrompt(): Promise<string> {
  // Return cached prompt if available
  if (cachedPrompt) {
    return cachedPrompt;
  }

  const schemaSection = loadSchemaFiles();
  
  // Fetch actual property types and classifications from database
  const propertyTypes = await getPropertyTypes();
  
  let propertyTypesSection = "\n\nAVAILABLE PROPERTY TYPES AND CLASSIFICATIONS:\n\n";
  for (const type of propertyTypes) {
    propertyTypesSection += `PropertyType: "${type.name}" (id: ${type.id})\n`;
    if (type.classifications && type.classifications.length > 0) {
      propertyTypesSection += `  Classifications:\n`;
      for (const classification of type.classifications) {
        propertyTypesSection += `    - "${classification.name}" (id: ${classification.id})\n`;
      }
    }
    propertyTypesSection += "\n";
  }
  
  const criticalRules = `
    ═══════════════════════════════════════════════════════════════════════════════
    AI PROPERTY SEARCH PROMPT - RULE-BASED SCHEMA COMPLIANCE
    ═══════════════════════════════════════════════════════════════════════════════

    TASK: Convert natural language property search queries into VALID Prisma WHERE clauses for Virify listings.
    CRITICAL: Study the RELEVANT PRISMA SCHEMA and AVAILABLE PROPERTY TYPES sections below CAREFULLY. Use EXACT field names, relations, and enum values from the schema - NO INVENTIONS.

    ═══════════════════════════════════════════════════════════════════════════════
    MANDATORY SCHEMA LOOKUP PROTOCOL
    ═══════════════════════════════════════════════════════════════════════════════

    BEFORE WRITING ANY QUERY: Read the RELEVANT PRISMA SCHEMA section and find the EXACT field/relation for each term.

    STEP 1 - FIELD IDENTIFICATION:
      - "garden" → Schema lookup: OutdoorSpace.garden Garden[] (one-to-many relation inside outdoorSpace)
      - "parking" → Schema lookup: Property.parking Parking? (one-to-one relation)
      - "garage" → Schema lookup: Parking.features ParkingFeature[] (enum array on parking relation)
      - "EPC" → Schema lookup: EnergyAndUtilities.epcRating EPCRating (direct enum)
      - "amenities" → Schema lookup: Property.amenities Amenities[] (model list relation)

    STEP 2 - APPLY EXACT TYPE RULES:
      - Direct enum (e.g., epcRating): { field: "VALUE" }
      - Enum array (e.g., features): { field: { has: "VALUE" } }
      - One-to-one relation (e.g., parking?): { relation: { is: { ... } } } or { isNot: null }
      - One-to-many relation (e.g., bedroomFeatures[]): { relation: { some: { ... } } }
      - Model list (e.g., amenities[]): { relation: { some: { field: "VALUE" } } }

    STEP 3 - NESTING PROTOCOL (CRITICAL - MODEL FIELD SEPARATION):
      
      LISTING MODEL FIELDS (top level only, NEVER inside property):
      - price, archived, published, moveInDate, listingTier, userId, propertyId
      - saleListing (optional relation - use { isNot: null } for presence)
      - rentalListing (optional relation - use { isNot: null } for presence)
      - user (optional relation - use { is: { username: ... } } for username filtering)
      
      PROPERTY MODEL FIELDS (inside property.is ONLY):
      - numberBedrooms, numberBathrooms, numberReceptions, type, classification
      - parking, outdoorSpace, amenities, energyAndUtilities, securityFeatures, etc.
      
      CRITICAL RULES:
      - saleListing and rentalListing are NEVER nested inside property: { is: { ... } }
      - Property filters are NEVER at the root level (except property: { is: { ... } })
      - Garden inside outdoorSpace: outdoorSpace: { is: { garden: { some: { ... } } } }
      - ALL Property model fields MUST be nested under property: { is: { ... } }
      
      WRONG (NEVER DO THIS):
      - { property: { is: { saleListing: { isNot: null } } } }
      - { property: { is: { rentalListing: { isNot: null } } } }
      - { numberBedrooms: 3 } (property fields at root)
      
      CORRECT:
      - { saleListing: { isNot: null }, property: { is: { numberBedrooms: 3 } } }
      - { rentalListing: { isNot: null }, price: { lte: 2000 } }
      - { property: { is: { parking: { isNot: null } } } }

    CRITICAL EXAMPLES:
    - "has garden" → property: { is: { outdoorSpace: { is: { garden: { some: {} } } } } }
    - "has garage" → property: { is: { parking: { is: { features: { has: "GARAGE" } } } } }
    - "EPC C or better" → property: { is: { energyAndUtilities: { is: { epcRating: { in: ["A", "B", "C"] } } } } }
    - "has gym nearby" → property: { is: { amenities: { some: { type: "HEALTHCARE", subtype: "GYM" } } } }

    ═══════════════════════════════════════════════════════════════════════════════
    QUERY TYPE RULES
    ═══════════════════════════════════════════════════════════════════════════════

    - PRICE QUERIES: "£300k", "under £500k" → { "price": { "lte": 500000 } }
    - PRICE RANGE (hyphen): "290k-310k", "£290,000-£310,000" → { "price": { "gte": 290000, "lte": 310000 } }
    - PRICE RANGE (verbal): "between 290k and 310k", "290k to 310k", "from £290k to £310k" → { "price": { "gte": 290000, "lte": 310000 } }

    PRICE IS ALWAYS TOP-LEVEL — NEVER INSIDE property OR saleListing/rentalListing:
      WRONG (causes Prisma error "Unknown argument price"):
        { "property": { "is": { "price": { "gte": 290000, "lte": 310000 } } } }
        { "saleListing": { "is": { "price": { "lte": 500000 } } } }
      CORRECT:
        { "price": { "gte": 290000, "lte": 310000 }, "property": { "is": { "numberBedrooms": 2 } } }
        { "price": { "lte": 500000 }, "saleListing": { "isNot": null } }

    - BEDROOM/BATHROOM: "3 beds" → "property": { "is": { "numberBedrooms": 3 } }
    - PROPERTY TYPE: "House" → "property": { "is": { "type": { "name": "House" } } }
    - CLASSIFICATION: "Detached" → "property": { "is": { "classification": { "name": "Detached" } } }
    - LOCATION: Use address fields if specified, but schema may not have full location.
    - FEATURES: See RULE-BASED 'HAS' section below.

    IMPORTANT: PropertyType and PropertyClassification are SEPARATE relations on Property.
    
    PropertyType fields: id, name, description, icon
    PropertyClassification fields: id, name, description, propertyTypeId
    
    They are sibling relations, NOT nested:
    WRONG: "type": { "name": "House", "classification": { ... } }
    CORRECT: "type": { "name": "House" }, "classification": { "name": "Detached" }

    ═══════════════════════════════════════════════════════════════════════════════
    RULE-BASED 'HAS' AND FIELD MAPPING (MANDATORY SCHEMA LOOKUP)
    ═══════════════════════════════════════════════════════════════════════════════

    FOR EVERY 'has [X]' or feature query, FIRST look up the exact field/relation in the RELEVANT PRISMA SCHEMA section above.
    Determine the field's type from the schema definition (e.g., field: Type?, field: Type[], @relation, etc.).
    APPLY THESE EXACT RULES BASED ON SCHEMA TYPE (no exceptions, no guessing):

    * DIRECT SINGLE ENUM (e.g., constructionType ConstructionType?, boilerType BoilerType?):
      - Presence: { [field]: { not: null } }
      - Specific: { [field]: "ENUM_VALUE" }

    * DIRECT ENUM ARRAY (e.g., features ParkingFeature[], renewables RenewableEnergy[]):
      - Presence: { [field]: { isEmpty: false } }
      - Specific: { [field]: { has: "ENUM_VALUE" } } or { hasSome: ["VAL1", "VAL2"] }

    * ONE-TO-ONE RELATION (e.g., parking Parking?, securityFeatures Security?):
      - Presence: { [relation]: { isNot: null } }
      - With features: { [relation]: { is: { features: { isEmpty: false } } } }
      - Specific feature: { [relation]: { is: { features: { has: "ENUM_VALUE" } } } }
      
      CRITICAL: When nested inside property.is, use "isNot" for presence checks:
      - "has parking" → property: { is: { parking: { isNot: null } } }
      - NOT property: { is: { isNot: null } } ("isNot" goes on the relation field, not on "is")

    * ONE-TO-MANY RELATION (e.g., bedroomFeatures Bedroom[], kitchenFeatures Kitchen[]):
      - Presence: { [relation]: { some: {} } }
      - With features: { [relation]: { some: { features: { isEmpty: false } } } }
      - Specific feature: { [relation]: { some: { features: { has: "ENUM_VALUE" } } } }

    * RELATION WITH TYPE/FIELD (e.g., reception Reception[], otherRoom OtherRoom[] with type ReceptionType):
      - Presence: { [relation]: { some: {} } }
      - Specific type: { [relation]: { some: { type: "ENUM_VALUE" } } }

    * MODEL LIST RELATIONS (e.g., amenities Amenities[] where Amenities is a model):
      - Presence: { [relation]: { some: {} } }
      - Specific: { [relation]: { some: { [field]: "VALUE" } } } (check model fields like type, name)

    ALWAYS nest property fields inside property: { is: { ... } }
    If unsure, default to presence check using the appropriate wrapper (isNot for one-to-one, some for arrays).

    Examples (verified against schema):
    - "has garage": property: { is: { parking: { is: { features: { has: "GARAGE" } } } } }
    - "has garden": property: { is: { outdoorSpace: { is: { garden: { some: {} } } } } }
    - "has en-suite": property: { is: { bedroomFeatures: { some: { features: { has: "EN_SUITE" } } } } }
    - "has kitchen island": property: { is: { kitchenFeatures: { some: { features: { has: "ISLAND" } } } } }
    - "has gym nearby": property: { is: { amenities: { some: { type: "HEALTHCARE", subtype: "GYM" } } } }

    ═══════════════════════════════════════════════════════════════════════════════
    EPC RATING LOGIC
    ═══════════════════════════════════════════════════════════════════════════════

    - EPC ratings are ordered from best to worst: A, B, C, D, E, F, G.
    - If a user queries for "EPC higher than C" or "EPC > C", it means C, B, and A (i.e., all ratings better than or equal to C).
    - If a user queries for "EPC lower than C" or "EPC < C", it means D, E, F, G (all ratings worse than C).
    - If a user queries for "EPC C or better", include C, B, and A.
    - If a user queries for "EPC C or worse", include C, D, E, F, G.
    - Prisma query for EPC rating must use:
      property: { is: { energyAndUtilities: { is: { epcRating: { in: ["A", "B", "C"] } } } } }
    - Always use the correct enum values: "A", "B", "C", "D", "E", "F", "G" (as defined in the schema).
    - NEVER use comparison operators like gt, lt, gte, lte on enum fields - use 'in' arrays instead.

    ═══════════════════════════════════════════════════════════════════════════════
    NUMBER NOTATION
    ═══════════════════════════════════════════════════════════════════════════════
    
    - "k" = thousand: "400k" → 400000
    - "m" = million: "1.5m" → 1500000
    - "+N" or "N+" means "at least N": "3+ bedroom" → { gte: 3 }
    - Ranges with hyphen: "2-4" means between 2 and 4, "200k-500k" → { gte: 200000, lte: 500000 }
    - Currency: "£" or "gbp" both mean GBP (British pounds)

    ═══════════════════════════════════════════════════════════════════════════════
    IMPORTANT FIELD MAPPINGS
    ═══════════════════════════════════════════════════════════════════════════════
    
    - Bedroom/bathroom counts: property: { is: { numberBedrooms: N, numberBathrooms: N } }
    - Property type IS A RELATION: property: { is: { type: { name: "House" } } }
    - Property classification IS A RELATION: property: { is: { classification: { name: "Detached" } } }
    - OtherRoom type IS DIRECT ENUM: property: { is: { otherRoom: { some: { type: "OFFICE" } } } }
    - Floor level: 0=ground, positive=above, negative=below
    - Always filter out archived: { archived: false } (unless explicitly requested)
    - Existence checks for Property relations: { parking: { isNot: null } } or { parking: { is: null } }

    ═══════════════════════════════════════════════════════════════════════════════
    LISTING TYPE MAPPING (CRITICAL - EXACT SYNTAX REQUIRED)
    ═══════════════════════════════════════════════════════════════════════════════

    The Listing model has TWO optional one-to-one relations: saleListing and rentalListing.
    THESE ARE THE ONLY FIELDS ON LISTING WHERE "isNot" IS VALID AT THE ROOT LEVEL.

    CORRECT USAGE:
    - "For sale" → { "saleListing": { "isNot": null } }
    - Synonyms: "To buy", "Buy", "To purchase", "Purchase" → treat as "For sale"
    - "For rent" or "To rent" → { "rentalListing": { "isNot": null } }
    - Synonyms: "To let", "Let", "Rental" → treat as "For rent"

    NEVER use "isNot" directly inside property: { is: { ... } } filters.
    Property filters use proper relation syntax as documented in the schema section above.

    When querying specific sale/rental fields, nest under the appropriate relation:
    - Sale price query: { "saleListing": { "is": { "priceType": "FIXED" } } }
    - Rent query: { "rentalListing": { "is": { "rentFrequency": "MONTHLY" } } }

    In "usedTerms" ALWAYS use: "For sale" or "To rent" — NEVER "saleListing" or "rentalListing".

    ═══════════════════════════════════════════════════════════════════════════════
    USERNAME / USER SEARCH
    ═══════════════════════════════════════════════════════════════════════════════

    Listings have an optional user relation (User model with username String? @unique).
    Use this for queries about who listed a property.

    PATTERNS:
    - "by [username]", "listed by [username]", "from [username]" → { "user": { "is": { "username": { "equals": "username", "mode": "insensitive" } } } }
    - "listings by @username" → strip the "@" prefix and match: { "user": { "is": { "username": { "equals": "username", "mode": "insensitive" } } } }

    NOTES:
    - Username matching is ALWAYS case-insensitive.
    - "user" is a top-level Listing field — NEVER nest it inside property: { is: { ... } }
    - In "usedTerms" use the full phrase: "Listed by @username" or "By username"

    ═══════════════════════════════════════════════════════════════════════════════
    AMENITY SEARCH RULES
    ═══════════════════════════════════════════════════════════════════════════════

    Amenities are stored as a list of nearby facilities with type, subtype, and distanceM (in meters).
    For location-based queries, use these generic rules:

    * BASIC AMENITY PRESENCE:
      - "near [amenity]" → property: { is: { amenities: { some: { [field]: "[VALUE]" } } } }
      - Map common terms to schema values:
        - "school" → type: "EDUCATION", subtype: "SCHOOL"
        - "hospital" → type: "HEALTHCARE", subtype: "HOSPITAL"
        - "train station" → type: "TRANSPORT", subtype: "TRAIN_STATION"
        - "bus stop" → type: "TRANSPORT", subtype: "BUS_STOP"
        - "park" → type: "GREEN_SPACE", subtype: "PARK"
        - "gym" → type: "SHOPPING_ENTERTAINMENT", subtype: "GYM"

    * DISTANCE-BASED SEARCH:
      - "within [N] miles of [amenity]" → property: { is: { amenities: { some: { [field]: "[VALUE]", distanceM: { lte: [N * 1609] } } } } }
      - Convert miles to meters: 1 mile = 1609 meters
      - Examples: "within 2 miles" = distanceM: { lte: 3218 }

    * MULTIPLE AMENITIES:
      - Combine with AND: multiple some conditions on amenities
      - "near school and gym" → amenities: { some: { type: "EDUCATION" } }, amenities: { some: { type: "SHOPPING_ENTERTAINMENT" } }

    ═══════════════════════════════════════════════════════════════════════════════
    RESPONSE FORMAT
    ═══════════════════════════════════════════════════════════════════════════════
    
    Return ONLY **STRICT VALID JSON** with ALL property names in double quotes (no markdown, no comments, no JavaScript object notation):
    
    CORRECT JSON FORMAT:
    {
      "whereClause": { "archived": false, "price": { "gte": 100000 } },
      "queryAnalysis": {
        "usedTerms": ["term1", "term2"],
        "ignoredTerms": ["term3"]
      }
    }
    
    INCORRECT (JavaScript object notation - DO NOT USE):
    {
      whereClause: { archived: false }, Missing quotes around property names
      queryAnalysis: { ... }
    }
    
    ALL property names MUST be quoted: "in", "gte", "lte", "has", "some", "is", etc.
    
    IMPORTANT - usedTerms MUST be human-readable summaries:
    - Price: Format with currency symbol and commas: "£300,000" or "Under £500,000" or "£200k-£400k"
    - Bedrooms: Combine ranges: "3-4 bedrooms" or "3+ bedrooms" or "3 bedrooms"
    - Bathrooms: Same as bedrooms: "2+ bathrooms" or "2 bathrooms"
    - Property type: Use proper capitalization: "House" not "HOUSE", "Detached house" not "DETACHED_HOUSE"
    - Features: Human readable: "En-suite" not "EN_SUITE", "South-facing garden" not "SOUTH facing", "Garden" for garden presence
    - Listing type: "For sale" or "To rent" not "saleListing" or "rentalListing"
    - Location terms: Keep city/area names as-is
    - Amenities: Include distance context: "Near hospital", "Within 2 miles of gym", "Close to school"
    - Combine related terms into single phrases, not individual words
    
    Examples of GOOD usedTerms:
    ["3-4 bedrooms", "House", "For sale", "Under £300,000", "Cardiff", "Near hospital", "Within 2 miles of gym"]
    ["2+ bathrooms", "Detached house", "En-suite", "Garage", "South-facing garden", "Close to school"]
    ["Furnished", "To rent", "£1,000-£1,500 pcm", "City centre", "Near train station"]
    
    Examples of BAD usedTerms:
    ["3", "4", "bedroom", "house", "sale", "300000"] [wrong - split terms]
    ["DETACHED_HOUSE", "EN_SUITE", "GARAGE"] [wrong - enum values not human text]
    ["saleListing", "rentalListing"] [wrong - use "For sale" or "To rent"]
    ["school", "gym"] [wrong - use "Near school", "Close to gym"]
    `;

  // Combine all sections
  cachedPrompt = criticalRules + propertyTypesSection + schemaSection;
  
  return cachedPrompt;
}
