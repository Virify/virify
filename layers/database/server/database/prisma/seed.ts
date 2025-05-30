// Need to use `ts-node` to run this file and add ts extension to the file name

import { PrismaClient } from "@prisma/client";
import { saleAddress, rentalAddress, cityCenters } from "../../utils/seed/address-to-seed.ts";
import { seedFakeUsers } from "../../utils/seed/user-faker.ts";
import { generateProperty } from "../../utils/seed/property-faker.ts";
import { generateRentalListing, generateSaleListing } from "../../utils/seed/listing-faker.ts";
import { updateLocationsByAddressListForSeed } from "../../utils/seed/location-for-seed.ts";
const prisma = new PrismaClient();
import dotenv from 'dotenv';
dotenv.config();



/**
 * Seeding function to populate the database with initial data.
 * This function is called when the database is initialized or reset.
 */
const seed = async () => {
  await seedAdminUser();
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

  await seedFakeUsers(200);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Seeding function to create an admin user in the database.
 * This function is called when the database is initialized or reset.
 */
async function seedAdminUser() {
  const adminUser = {
    email: process.env.ADMIN_EMAIL || "default_admin_email@example.com",
    password: process.env.ADMIN_PASSWORD || "default_admin_password",
    username: process.env.ADMIN_USERNAME || "default_admin_username",
    firstName: "Virify",
    lastName: "Admin",
  }

  await prisma.user.create({
    data: {
      email: adminUser.email,
      password: adminUser.password,
      username: adminUser.username,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      verification: {
        create: {
          activated: true,
        },
      },
      address: {
        create: {
          street: "123 Admin St",
          city: "Admin City",
          postcode: "12345",
          country: "Admin Country",
        },
      }
    }
  })
}
    
/**
 * Seeding function to populate city center addresses in the database.
 */
async function seedCityCenters() {
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

  await updateLocationsByAddressListForSeed(created as {
    id: number;
    lat: number;
    lon: number;
  }[]);
}

/**
 * Seeding function to populate property types and classifications in the database.
 */
async function seedPropertyTypes() {
  const types = {
    House: ["Terraced", "Semi-detached", "End of terrace", "Detached", "Mansion"],
    Cottage: ["Terraced", "Detached", "Semi-detached", "End of terrace"],
    Bungalow: ["Terraced", "Semi-detached", "End of terrace", "Detached"],
    Flat: ["Converted flat", "Studio flat", "Maisonette", "High-rise", "Within a complex", "Penthouse"],
    Land: ["Residential Land", "Commercial Land", "Agricultural Land", "Development plot", "Development potential"],
    Farms: ["Non-working Farmhouse", "Working Farm", "Small Holding"],
    Specialty: ["Shared Ownership", "Retirement Home", "New Build Home"],
    "Student Accommodation": ["Flat", "House", "House-share"],
  };


  for (const [typeName, classification] of Object.entries(types)) {
    const createTypes = await prisma.propertyType.create({
      data: {
        name: typeName,
        defaultSelected: true,
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
