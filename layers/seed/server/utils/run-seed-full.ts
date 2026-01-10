#!/usr/bin/env tsx
/**
 * Full seed for staging/demo - seeds base data + demo properties, listings, users
 * Usage: pnpm db:seed:full
 */

import { config } from 'dotenv'
config()

import { prisma } from '../../../database/server/utils/prisma-client'
import { MembershipType } from "../../../database/server/database/prisma/generated/enums"
import { updateLocationsByAddressListForSeed } from './location-for-seed'
import { generateProperty } from './property-faker'
import { seedFakeUsers, distributeListingsToUsers } from './user-faker'
import { rentalAddress, saleAddress, cityCenters } from './address-to-seed'
import { seedAdminFavourites } from './admin-favourites-seed'

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
          defaultSelected: true,
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
            activated: true,
            role: 'ADMIN',
          },
        },
        address: {
          create: {
            street: '123 Admin St',
            city: 'Admin City',
            postcode: '12345',
            country: 'Admin Country',
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
    
    // Generate properties only (listings will be assigned later)
    const saleProperties = await Promise.all(
      saleAddress.map(addr => generateProperty(addr))
    );
    const rentalProperties = await Promise.all(
      rentalAddress.map(addr => generateProperty(addr))
    );
    
    console.log(`✅ Properties created: ${saleProperties.length} sale, ${rentalProperties.length} rental`);

    console.log('👥 Seeding fake users...')
    const userIds = await seedFakeUsers(1000)
    console.log('✅ Fake users seeded.')

    console.log('🏠 Distributing listings to users...')
    await distributeListingsToUsers(userIds)
    console.log('✅ Listings distributed.')

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
