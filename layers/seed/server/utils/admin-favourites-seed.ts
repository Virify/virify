import { faker } from "@faker-js/faker";
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

  // Get 100 sale listings and 100 rental listings for favourites (Total 200)
  const favSaleListings = await prisma.listing.findMany({
    where: { saleListing: { isNot: null } },
    take: 100,
    select: { id: true }
  })

  const favRentalListings = await prisma.listing.findMany({
    where: { rentalListing: { isNot: null } },
    take: 100,
    select: { id: true }
  })

  // Get 100 DIFFERENT sale listings and 100 DIFFERENT rental listings for notes (Total 200)
  const noteSaleListings = await prisma.listing.findMany({
    where: { 
      saleListing: { isNot: null },
      NOT: { id: { in: favSaleListings.map(l => l.id) } }
    },
    take: 100,
    select: { id: true }
  })

  const noteRentalListings = await prisma.listing.findMany({
    where: { 
      rentalListing: { isNot: null },
      NOT: { id: { in: favRentalListings.map(l => l.id) } }
    },
    take: 100,
    select: { id: true }
  })

  const allFavouriteListings = [...favSaleListings, ...favRentalListings]
  const allNoteListings = [...noteSaleListings, ...noteRentalListings]
  
  console.log(`Found ${favSaleListings.length} sale + ${favRentalListings.length} rental favourites, ${noteSaleListings.length} sale + ${noteRentalListings.length} rental for notes`)

  // Update admin user with preferences, favourites and notes
  // Note: Saved locations removed - they require valid geocoded data from MapTiler API
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
          },
        },
      },
    },
  })

  console.log(`Created ${allFavouriteListings.length} favourites and ${allNoteListings.length} notes for admin user`)
}