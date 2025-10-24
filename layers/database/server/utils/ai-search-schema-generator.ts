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
    Convert natural language property queries to a valid Prisma WHERE clause JSON for the Virify property search. Use ONLY the fields, relations, and enum values exactly as defined below. Do NOT invent or generalize field names. Follow the structure and rules precisely.

    CRITICAL RULES:
    - DO NOT NEST saleListing or rentalListing (or any of their fields) inside property or any nested object. This is a SCHEMA VIOLATION and will cause a FATAL ERROR. These fields MUST ONLY appear at the ROOT level of the query.
    - The 'property' field on Listing is a ONE-TO-ONE relation. You MUST wrap ALL property filters inside 'is: { ... }'. For example: { property: { is: { numberBedrooms: 3, type: { name: "House" } } } }
    - NEVER add Comments or quotes or markdown formatting to the AI response. The response MUST be a valid JSON object with a "whereClause" and "queryAnalysis" field. Any comments, quotes, or markdown will cause a FATAL ERROR.
    - Ensure all JSON brackets and braces are properly closed. Missing closing braces will cause parsing errors.
    - To filter by fields of rentalListing or saleListing, you MUST use the correct Prisma relation filter syntax:
      * To filter for existence: { rentalListing: { isNot: null } }
      * To filter by fields: { rentalListing: { is: { furnishedStatus: "FURNISHED" } } }
      * NEVER use { rentalListing: { furnishedStatus: ... } } (this is INVALID and will cause an error)

    IMPORTANT FIELD LOCATIONS:
    - garage, driveway, parking fields → property: { is: { parking: { is: { garage: true, driveway: true } } } }
    - garden → property: { is: { outdoorSpace: { is: { garden: { some: {} } } } } }
    - All bedroom/bathroom counts → property: { is: { numberBedrooms: 3, numberBathrooms: 2 } }
    - Bathroom floor location → property: { is: { bathroomFeatures: { some: { floor: 0 } } } } (0=ground, 1=first, etc. downstairs = ground)
    - Property type (House/Flat/etc) → property: { is: { type: { name: "House" } } } (type is a RELATION to PropertyType model)
    - Property classification (Detached/Semi-detached/Terraced) → property: { is: { classification: { name: "Detached" } } } (classification is a RELATION to PropertyClassification model)
    - Office/Study/Gym etc → property: { is: { otherRoom: { some: { type: "OFFICE" } } } } (type is an ENUM field, use the enum value directly, NOT { name: "OFFICE" })
    
    CRITICAL: Distinguish between RELATIONS and ENUM fields:
    - PropertyType and PropertyClassification are MODELS (relations), so use: { type: { name: "House" } }
    - OtherRoomType, FireplaceType, ReceptionType, BedSizeType etc are ENUMS, so use the value directly: { type: "OFFICE" }

    QUERY ANALYSIS REQUIREMENTS:
    You MUST return a JSON object with:
    {
      "whereClause": { ... },
      "queryAnalysis": {
        "usedTerms": ["term1", "term2"],  // All terms from query that were mapped to schema
        "ignoredTerms": ["term3"]         // All terms that couldn't be mapped
      }
    }
    `;

  // Combine all sections
  cachedPrompt = criticalRules + propertyTypesSection + schemaSection;
  
  return cachedPrompt;
}
