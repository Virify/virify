// Need to use `ts-node` to run this file and add ts extension to the file name

import { PrismaClient } from "@prisma/client";
import { address, cityCenters } from "../../utils/address-to-seed.ts";
import { generateProperty } from "../../utils/property-faker.ts";
import { generateRentalListing, generateSaleListing } from "../../utils/listing-faker.ts";
const prisma = new PrismaClient();

/**
 * Seeding function to populate the database with initial data.
 * This function is called when the database is initialized or reset.
 */
const seed = async () => {
  await seedCityCenters();
  await seedPropertyTypes();

  for (const addr of address) {
    let property = await generateProperty(addr);
    await generateSaleListing(property.id);
    await generateRentalListing(property.id);
  }
  console.log("Seeding completed successfully.");
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

export async function seedCityCenters() {
  const addresses = await prisma.address.createMany({
    data: cityCenters,
    skipDuplicates: true,
  });
}

/**
 * Seeding function to populate property types and classifications in the database.
 */
export async function seedPropertyTypes() {
  const types = {
    House: ["Terraced", "Semi-detached", "End of terrace", "Detached", "Mansion"],
    Cottage: ["Terraced", "Detached", "Semi-detached", "End of terrace"],
    Bungalow: ["Terraced", "Semi-detached", "End of terrace", "Detached"],
    Flat: ["Converted flat", "Studio flat", "Maisonette", "High-rise", "Within a complex", "Penthouse"],
    Land: ["Residential Land", "Commercial Land", "Agricultural Land", "Development plot", "Development potential"],
    Farms: ["Non-working Farmhouse", "Working Farm", "Small Holding"],
    Specialty: ["Shared Ownership", "Retirement Homes", "New Build Homes"],
    "Student Accommodation": ["Flat", "House", "House-share"],
  };

  for (const [typeName, classification] of Object.entries(types)) {
    const createTypes = await prisma.propertyType.create({
      data: {
        name: typeName,
        classifications: {
          create: classification.map((name) => ({ name })),
        },
      },
    });

    if (classification.length === 0) {
      console.log(`Seeded category '${typeName}' with no subtypes.`);
    }
  }
}
