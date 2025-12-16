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
