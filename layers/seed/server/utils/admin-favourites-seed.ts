import { faker } from "@faker-js/faker";
import { geocodingFeature } from "./user-faker";
import { prisma } from "../../../database/server/utils/prisma-client";

/**
 * Seeding function to add favourites and notes to the admin user.
 */
export async function seedAdminFavourites() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@virify.com'
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!admin) {
    console.log('Admin user not found, skipping favourites seeding.')
    return
  }

  // Get 20 sale listings and 20 rental listings for favourites
  const favSaleListings = await prisma.listing.findMany({
    where: { saleListing: { isNot: null } },
    take: 20,
    select: { id: true }
  })

  const favRentalListings = await prisma.listing.findMany({
    where: { rentalListing: { isNot: null } },
    take: 20,
    select: { id: true }
  })

  // Get 20 DIFFERENT sale listings and 20 DIFFERENT rental listings for notes
  const noteSaleListings = await prisma.listing.findMany({
    where: { 
      saleListing: { isNot: null },
      NOT: { id: { in: favSaleListings.map(l => l.id) } }
    },
    take: 20,
    select: { id: true }
  })

  const noteRentalListings = await prisma.listing.findMany({
    where: { 
      rentalListing: { isNot: null },
      NOT: { id: { in: favRentalListings.map(l => l.id) } }
    },
    take: 20,
    select: { id: true }
  })

  const allFavouriteListings = [...favSaleListings, ...favRentalListings]
  const allNoteListings = [...noteSaleListings, ...noteRentalListings]
  
  console.log(`Found ${favSaleListings.length} sale + ${favRentalListings.length} rental favourites, ${noteSaleListings.length} sale + ${noteRentalListings.length} rental for notes`)

  // Build 10 fake TEST saved locations
  const testSavedLocations = Array.from({ length: 10 }).map((_, i) => {
    const city = faker.location.city();
    const street = faker.location.streetAddress();
    const country = faker.location.country();
    const address = `${street}, ${city}, ${country}`;
    const lat = Number(faker.location.latitude({ min: 50, max: 57 }));
    const lon = Number(faker.location.longitude({ min: -6, max: 2 }));
    const name = `${city}`;

    return {
      location: address,
      geocodingFeature: {
        id: faker.string.uuid(),
        text: city,
        type: 'Feature',
        place_name_en: address,
        place_name: address,
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: {}
      },
      lat,
      lon,
      name
    }
  })

  // Update admin user with preferences, favourites, notes and saved locations
  await prisma.user.update({
    where: { id: admin.id },
    data: {
      preferences: {
        upsert: {
          where: { userId: admin.id },
          create: {
            favourites: {
              create: allFavouriteListings.map((listing) => ({ 
                listingId: listing.id,
                note: faker.lorem.sentence(),
              })),
            },
            notes: {
              create: allNoteListings.map((listing) => ({
                listingId: listing.id,
                note: faker.lorem.sentence(),
              })),
            },
            savedLocation: {
              create: [
                {
                  location: geocodingFeature.place_name_en,
                  geocodingFeature: geocodingFeature,
                  lat: Number(geocodingFeature.geometry.coordinates[1]),
                  lon: Number(geocodingFeature.geometry.coordinates[0]),
                  name: "admin home location",
                },
                ...testSavedLocations
              ],
            },
          },
          update: {
            favourites: {
              deleteMany: {},
              create: allFavouriteListings.map((listing) => ({ 
                listingId: listing.id,
                note: faker.lorem.sentence(),
              })),
            },
            notes: {
              deleteMany: {},
              create: allNoteListings.map((listing) => ({
                listingId: listing.id,
                note: faker.lorem.sentence(),
              })),
            },
            savedLocation: {
              deleteMany: {},
              create: [
                {
                  location: geocodingFeature.place_name_en,
                  geocodingFeature: geocodingFeature,
                  lat: Number(geocodingFeature.geometry.coordinates[1]),
                  lon: Number(geocodingFeature.geometry.coordinates[0]),
                  name: "admin home location",
                },
                ...testSavedLocations
              ]
            }
          },
        },
      },
    },
  })

  console.log(`Created ${allFavouriteListings.length} favourites, ${allNoteListings.length} notes and ${testSavedLocations.length + 1} saved locations for admin user`)
}