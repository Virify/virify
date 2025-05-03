// Need to use `ts-node` to run this file and add ts extension to the file name

import { PrismaClient } from "@prisma/client";
import { saleAddress, rentalAddress, cityCenters } from "../../utils/address-to-seed.ts";
import { generateProperty } from "../../utils/property-faker.ts";
import { generateRentalListing, generateSaleListing } from "../../utils/listing-faker.ts";
import { updateLocationsByAddressList } from "../../utils/location.ts";
const prisma = new PrismaClient();

/**
 * Seeding function to populate the database with initial data.
 * This function is called when the database is initialized or reset.
 */
const seed = async () => {
  await seedCityCenters();
  await seedPropertyTypes();

  for (const addr of saleAddress) {
    let property = await generateProperty(addr);
    await generateSaleListing(property.id);
  }
  for (const addr of rentalAddress) {
    let property = await generateProperty(addr);
    await generateRentalListing(property.id);
  }
  console.log("Seeding completed successfully.");
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Seeding function to populate city center addresses in the database.
 */
export async function seedCityCenters() {
  const created = await Promise.all(
    cityCenters.map((center) =>
      prisma.address.upsert({
        where: {
          street_city_postcode_country: {
            street: center.street,
            city: center.city,
            postcode: center.postcode,
            country: center.country || "",
          },
        },
        update: {},
        create: center,
      })
    )
  );

  await updateLocationsByAddressList(created as {
    id: number;
    lat: number;
    lon: number;
  }[]);
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
