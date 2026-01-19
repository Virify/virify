#!/usr/bin/env tsx
/**
 * Full seed for staging/demo - seeds base data + demo properties, listings, users
 * Usage: pnpm db:seed:full
 */

import { config } from 'dotenv'
config()

import { prisma } from '../../../database/server/utils/prisma-client'
import { MembershipType, ListingTier } from "../../../database/server/database/prisma/generated/enums"
import { updateLocationsByAddressListForSeed } from './location-for-seed'
import { generateProperty } from './property-faker'
import { seedFakeUsers, distributeListingsToUsers } from './user-faker'
import { generateDailyUserStats } from './listing-faker'
import { rentalAddress, saleAddress, cityCenters } from './address-to-seed'
import { seedAdminFavourites } from './admin-favourites-seed'

/**
 * Generate a weighted listing tier for seeding
 * 60% BASIC, 30% FEATURED, 10% PREMIUM
 */
const generateWeightedTier = (): ListingTier => {
  const random = Math.random() * 100;
  if (random < 60) return ListingTier.BASIC;
  if (random < 90) return ListingTier.FEATURED;
  return ListingTier.PREMIUM;
};

/**
 * Seeding function to populate property types and classifications in the database.
 */
async function seedPropertyTypes() {
  const types = {
    House: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace', 'Mansion'],
    Cottage: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'],
    Bungalow: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'],
    Flat: ['Converted', 'Studio', 'Maisonette', 'High-rise', 'Within a Complex', 'Penthouse'],
    Land: ['Residential', 'Commercial', 'Agricultural', 'Development Plot', 'Development Potential'],
    Farms: ['Non-working', 'Working', 'Small Holding'],
    Specialty: ['Retirement Home', 'New Build Home'],
    'Student Accommodation': ['Flat', 'House', 'House-share'],
  }

  for (const [typeName, classification] of Object.entries(types)) {
    const existingType = await prisma.propertyType.findFirst({
      where: { name: typeName },
    })

    if (!existingType) {
      await prisma.propertyType.create({
        data: {
          name: typeName,
          defaultSelected: false,
          classifications: {
            create: classification.map(name => ({ name })),
          },
        },
      })
      console.log(`✅ Seeded property type '${typeName}'.`)
    }
  }
}

/**
 * Seeding function to create an admin user in the database.
 */
async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@virify.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'password',
        username: process.env.ADMIN_USERNAME || 'admin',
        firstName: 'Virify',
        lastName: 'Admin',
        verification: {
          create: {
            activated: 'ACTIVATED',
            role: 'ADMIN',
          },
        },
        address: {
          create: {
            street: '123 Admin St',
            city: 'Admin City',
            postcode: '12345',
            country: 'Admin Country',
            fullAddress: '123 Admin St, Admin City, 12345, Admin Country',
          },
        },
        membership: { 
          create: {
            type: MembershipType.PREMIUM,
          },
        },
      },
    })
    console.log('✅ Admin user created.')
  } else {
    console.log('ℹ️  Admin user already exists.')
  }
}

/**
 * Seeding function to populate city center addresses in the database.
 */
async function seedCityCenters() {
  const created = await Promise.all(
    cityCenters.map(center =>
      prisma.address.upsert({
        where: {
          number_street_city_postcode_country: {
            number: center.number || '',
            street: center.street,
            city: center.city,
            postcode: center.postcode,
            country: center.country || '',
          },
        },
        update: {},
        create: center,
      }),
    ),
  )

  await updateLocationsByAddressListForSeed(
    created as {
      id: number
      lat: number
      lon: number
    }[],
  )
  console.log('✅ City centers seeded.')
}

async function seedFullDatabase() {
  try {
    console.log('🌱 Running full database seeder (staging/demo)...')

    // Base seed
    console.log('📦 Seeding base data...')
    await seedAdminUser()
    await seedPropertyTypes()

    // Demo data
    console.log('🏙️  Seeding city centers...')
    await seedCityCenters()

    console.log('🏠 Seeding properties (without listings)...')
    
    // Generate properties with weighted tiers to limit images appropriately
    // 60% BASIC (5 images), 30% FEATURED (20 images), 10% PREMIUM (50 images)
    const saleResults = await Promise.all(
      saleAddress.map(addr => generateProperty(addr, generateWeightedTier()))
    );
    const rentalResults = await Promise.all(
      rentalAddress.map(addr => generateProperty(addr, generateWeightedTier()))
    );
    
    // Build a map of propertyId -> tier so listings use the same tier as their images
    const propertyTierMap = new Map<number, ListingTier>();
    for (const result of [...saleResults, ...rentalResults]) {
      propertyTierMap.set(result.property.id, result.tier);
    }
    
    console.log(`✅ Properties created: ${saleResults.length} sale, ${rentalResults.length} rental`);

    console.log('👥 Seeding fake users...')
    const userIds = await seedFakeUsers(1000)
    console.log('✅ Fake users seeded.')

    console.log('🏠 Distributing listings to users...')
    await distributeListingsToUsers(userIds, propertyTierMap)
    console.log('✅ Listings distributed.')

    console.log('📊 Generating daily user stats...')
    // Generate daily stats for a subset of users (admin + first 100 users for performance)
    const usersForStats = [1, ...userIds.slice(0, 100)]
    let statsGenerated = 0
    for (const userId of usersForStats) {
      await generateDailyUserStats(userId)
      statsGenerated++
      if (statsGenerated % 20 === 0) {
        console.log(`  Progress: ${statsGenerated}/${usersForStats.length} users...`)
      }
    }
    console.log('✅ Daily user stats generated.')

    console.log('⭐ Seeding admin favourites...')
    await seedAdminFavourites()
    console.log('✅ Admin favourites seeded.')

    console.log('✅ Full database seeding complete.')
    process.exit(0)
  }
  catch (e: any) {
    console.error('❌ Error during full database seeding:', e)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
  }
}

seedFullDatabase()
