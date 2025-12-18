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
    "property/energyAndUtils.prisma",
    "property/outdoor-space/outdoorSpace.prisma",
    "property/outdoor-space/garden.prisma",
    "property/outdoor-space/yard.prisma",
    "property/outdoor-space/land.prisma",
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
    Convert natural language property queries into valid Prisma WHERE clause JSON for Virify.
    Study the schema below carefully - it contains all available fields, relations, and enum values.

    ═══════════════════════════════════════════════════════════════════════════════
    CRITICAL RULES - COMMON MISTAKES THAT BREAK QUERIES
    ═══════════════════════════════════════════════════════════════════════════════
    
    1. PRICE FIELD IS AT ROOT LEVEL (most common error):
       CORRECT: { price: { lte: 500000 }, saleListing: { isNot: null } }
       WRONG: { saleListing: { is: { price: { lte: 500000 } } } }
       → Price is on Listing model, NOT on saleListing or rentalListing
    
    2. CRITICAL: ENUM FIELDS vs RELATION FIELDS
       
       READ THE MODEL DEFINITION IN THE SCHEMA TO DETERMINE FIELD TYPE:
       
       If field has @relation decorator → it's a RELATION → use object with fields like { name: "..." }
       Example in schema: type PropertyType @relation(...)
       In query: { type: { name: "House" } }
       
       If field type is an enum (defined in enum block) with NO @relation → it's DIRECT ENUM → use string value
       Example in schema: position GardenPosition?
       In query: { position: "REAR" }
       
       ONLY TWO RELATIONS IN THE ENTIRE SCHEMA USE .name:
       - Property.type (PropertyType model)
       - Property.classification (PropertyClassification model)
       
       EVERYTHING ELSE IS A DIRECT ENUM - DO NOT USE .name:
       - OtherRoom.type → "OFFICE"
       - Garden.position → "REAR" 
       - Garden.facing → "SOUTH"
       - All features arrays → "GARAGE", "EN_SUITE", etc.
       
       WRONG: { position: { name: "REAR" } }
       CORRECT: { position: "REAR" }
    
    3. ALL PROPERTY FEATURES MUST BE NESTED INSIDE property:
       
       WRONG: { parking: { is: { features: { has: "GARAGE" } } } } [parking is NOT on Listing!]
       CORRECT: { property: { is: { parking: { is: { features: { has: "GARAGE" } } } } } }
       
       WRONG: { bedroomFeatures: { some: { features: { has: "EN_SUITE" } } } } [not on Listing!]
       CORRECT: { property: { is: { bedroomFeatures: { some: { features: { has: "EN_SUITE" } } } } } }
    
    4. LISTING TYPE FILTERS ARE AT ROOT:
       CORRECT: { saleListing: { isNot: null } } // for sale properties
       CORRECT: { rentalListing: { isNot: null } } // for rentals
       WRONG: { property: { saleListing: { isNot: null } } }
    
    5. PROPERTY RELATION REQUIRES 'is' WRAPPER:
       ALL property fields and relations MUST be inside property: { is: { ... } }
       
       CORRECT: property: { is: { numberBedrooms: 3 } }
       WRONG: property: { numberBedrooms: 3 }
       WRONG: { parking: { is: { ... } } } [MUST be inside property!]
       CORRECT: { property: { is: { parking: { is: { ... } } } } }
       
       → Listing has property relation, Property has all the feature relations
       → parking, bedrooms, bathrooms, kitchen, etc. are ALL on Property, not Listing
    
    6. ONE-TO-ONE RELATIONS USE 'is':
       Use property: { is: { RELATION: { is: { ... } } } } for @unique relations:
       - parking, outdoorSpace, additionalFeatures, accessibilityFeatures
       - energyAndUtilities, runningCosts, securityFeatures, storageFeatures, utility
       Example: property: { is: { parking: { is: { features: { has: "GARAGE" } } } } }
    
    7. ONE-TO-MANY RELATIONS USE 'some':
       Use property: { is: { RELATION: { some: { ... } } } } for array relations:
       - bedroomFeatures, bathroomFeatures, kitchenFeatures, reception, otherRoom, amenities
       Example: property: { is: { bedroomFeatures: { some: { features: { has: "EN_SUITE" } } } } }
    
    8. NESTED RELATIONS (garden/yard/land inside outdoorSpace):
       CORRECT: property: { is: { outdoorSpace: { is: { garden: { some: { facing: "SOUTH" } } } } } }
       WRONG: property: { is: { garden: { some: { facing: "SOUTH" } } } }
       → garden, yard, and land are nested inside outdoorSpace, not direct children of property
    
    9. ENUM ARRAYS:
       - Single value: features: { has: "GARAGE" }
       - Multiple (AND): features: { hasEvery: ["GARAGE", "EV_CHARGING"] }
       - Multiple (OR): OR: [{ features: { has: "GARAGE" } }, { features: { has: "DRIVEWAY" } }]

    ═══════════════════════════════════════════════════════════════════════════════
    NUMBER NOTATION
    ═══════════════════════════════════════════════════════════════════════════════
    
    - "k" = thousand: "400k" → 400000
    - "m" = million: "1.5m" → 1500000
    - "+N" or "N+" means "at least N": "3+ beds" → { gte: 3 }
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
    - Existence checks: { parking: { isNot: null } } or { parking: { is: null } }

    ═══════════════════════════════════════════════════════════════════════════════
    RESPONSE FORMAT
    ═══════════════════════════════════════════════════════════════════════════════
    
    Return ONLY valid JSON (no markdown, no comments):
    {
      "whereClause": { ... },
      "queryAnalysis": {
        "usedTerms": ["term1", "term2"],
        "ignoredTerms": ["term3"]
      }
    }
    
    IMPORTANT - usedTerms MUST be human-readable summaries:
    - Price: Format with currency symbol and commas: "£300,000" or "Under £500,000" or "£200k-£400k"
    - Bedrooms: Combine ranges: "3-4 bedrooms" or "3+ bedrooms" or "3 bedrooms"
    - Bathrooms: Same as bedrooms: "2+ bathrooms" or "2 bathrooms"
    - Property type: Use proper capitalization: "House" not "HOUSE", "Detached house" not "DETACHED_HOUSE"
    - Features: Human readable: "En-suite" not "EN_SUITE", "South-facing garden" not "SOUTH facing"
    - Listing type: "For sale" or "To rent" not "saleListing" or "rentalListing"
    - Location terms: Keep city/area names as-is
    - Combine related terms into single phrases, not individual words
    
    Examples of GOOD usedTerms:
    ["3-4 bedrooms", "House", "For sale", "Under £300,000", "Cardiff"]
    ["2+ bathrooms", "Detached house", "En-suite", "Garage", "South-facing garden"]
    ["Furnished", "To rent", "£1,000-£1,500 pcm", "City centre"]
    
    Examples of BAD usedTerms:
    ["3", "4", "bedroom", "house", "sale", "300000"] [wrong - split terms]
    ["DETACHED_HOUSE", "EN_SUITE", "GARAGE"] [wrong - enum values not human text]
    ["saleListing", "rentalListing"] [wrong - use "For sale" or "To rent"]
    `;

  // Combine all sections
  cachedPrompt = criticalRules + propertyTypesSection + schemaSection;
  
  return cachedPrompt;
}
