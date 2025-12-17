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
    Convert natural language property queries to a valid Prisma WHERE clause JSON for the Virify property search. Use ONLY the fields, relations, and enum values exactly as defined in the schema below.

    CRITICAL PRISMA SYNTAX RULES:
    
    1. ROOT LEVEL ONLY: saleListing and rentalListing MUST appear at the ROOT of the query, never nested inside property.
    
    2. ONE-TO-ONE RELATIONS: Use 'is: { ... }' wrapper. Examples:
       - property: { is: { numberBedrooms: 3 } }
       - parking: { is: { features: { has: "GARAGE" } } }
       - outdoorSpace: { is: { garden: { some: {} } } }
    
    3. ONE-TO-MANY RELATIONS: Use 'some: { ... }' wrapper. Examples:
       - bathroomFeatures: { some: { floor: 0 } }
       - otherRoom: { some: { type: "OFFICE" } }
       - garden: { some: { facing: "SOUTH" } }
    
    4. ENUM ARRAYS: Use 'has' for single value, 'hasEvery' for multiple. Examples:
       - features: { has: "GARAGE" }
       - features: { hasEvery: ["GARAGE", "DRIVEWAY"] }
    
    5. EXISTENCE CHECK: Use 'isNot: null'. Examples:
       - saleListing: { isNot: null } (for sales)
       - rentalListing: { isNot: null } (for rentals)
    
    6. RELATIONS vs ENUMS:
       - PropertyType/PropertyClassification are RELATIONS: { type: { name: "House" } }
       - Other type fields are ENUMS: { type: "OFFICE" }

    NUMBER NOTATION RULES:
    
    7. "AT LEAST" NOTATION: Both "+3" and "3+" mean "at least 3" (use gte operator). Examples:
       - "+3 bedrooms" or "3+ bedrooms" → property: { is: { numberBedrooms: { gte: 3 } } }
       - "+2 bathrooms" or "2+ bathrooms" → property: { is: { numberBathrooms: { gte: 2 } } }
       - "+1 garden" or "1+ garden" → outdoorSpace: { is: { garden: { some: {} } } }
    
    8. ABBREVIATED NUMBERS: "k" = thousand, "m" = million. Examples:
       - "400k" = 400000
       - "1.5m" = 1500000
       - "250k" = 250000
       - Apply to price fields: { saleListing: { is: { price: { lte: 400000 } } } }
    
    9. RANGE QUERIES: "between X and Y" or "X-Y" or "X to Y" (use gte and lte together). Examples:
       - "between 1 and 3 bedrooms" → property: { is: { numberBedrooms: { gte: 1, lte: 3 } } }
       - "2-4 bathrooms" → property: { is: { numberBathrooms: { gte: 2, lte: 4 } } }
       - "between 200k and 500k" → saleListing: { is: { price: { gte: 200000, lte: 500000 } } }
       - "300k to 600k" → saleListing: { is: { price: { gte: 300000, lte: 600000 } } }

    COMMON SEARCH PATTERNS & EDGE CASES:
    
    10. LISTING STATUS: Always filter out archived listings unless explicitly requested:
        - Default: { archived: false }
        - Also consider: { published: true } for active listings only
    
    11. BOOLEAN DEFAULTS: Some booleans have specific meanings:
        - "chain free" → property: { is: { chainFree: true } }
        - "vacant" → property: { is: { vacant: true } }
        - "furnished" → rentalListing: { is: { furnishedStatus: "FURNISHED" } }
        - "unfurnished" → rentalListing: { is: { furnishedStatus: "UNFURNISHED" } }
    
    12. PARKING QUERIES: "parking" is ambiguous - check for specifics:
        - "with parking" → parking: { isNot: null }
        - "garage" → parking: { is: { features: { has: "GARAGE" } } }
        - "driveway" → parking: { is: { features: { has: "DRIVEWAY" } } }
        - "no parking" → parking: { is: { features: { has: "NO_PARKING" } } } (rare but explicit)
    
    13. GARDEN/OUTDOOR SPACE: Multiple interpretations:
        - "with garden" → outdoorSpace: { is: { garden: { some: {} } } }
        - "south facing garden" → outdoorSpace: { is: { garden: { some: { facing: "SOUTH" } } } }
        - "front garden" → outdoorSpace: { is: { garden: { some: { position: "FRONT" } } } }
    
    14. EN-SUITE QUERIES: Can mean bathroom OR bedroom feature:
        - "en-suite" generally → bathroomFeatures: { some: { features: { has: "EN_SUITE" } } }
        - "bedroom with en-suite" → bedroomFeatures: { some: { features: { has: "EN_SUITE" } } }
    
    15. FLOOR LEVEL: 0 = ground floor, positive = above, negative = below:
        - "ground floor" → property: { is: { floorLevel: 0 } }
        - "first floor" → property: { is: { floorLevel: 1 } }
        - "basement" → property: { is: { floorLevel: { lt: 0 } } }
    
    16. AVAILABILITY STATUS: Check listing status for sale/rental:
        - "available" (sale) → saleListing: { is: { availabilityStatus: "AVAILABLE" } }
        - "under offer" → saleListing: { is: { availabilityStatus: "UNDER_OFFER" } }
        - "available" (rental) → rentalListing: { is: { availabilityStatus: "AVAILABLE" } }
    
    17. TENURE TYPE (SALE ONLY): Freehold vs Leasehold:
        - "freehold" → saleListing: { is: { tenureType: "FREEHOLD" } }
        - "leasehold" → saleListing: { is: { tenureType: "LEASEHOLD" } }
    
    18. SIZE QUERIES: Property size is in square feet/meters (check units):
        - "over 1000 sqft" → property: { is: { size: { gte: 1000 } } }
        - Size may be null - handle gracefully with: { size: { not: null, gte: X } }

    RESPONSE FORMAT (JSON only, no markdown/comments):
    {
      "whereClause": { ... },
      "queryAnalysis": {
        "usedTerms": ["term1", "term2"],
        "ignoredTerms": ["term3"]
      }
    }
    `;

  // Combine all sections
  cachedPrompt = criticalRules + propertyTypesSection + schemaSection;
  
  return cachedPrompt;
}
