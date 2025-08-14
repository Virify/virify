#!/usr/bin/env tsx

import { config } from 'dotenv'

// Load environment variables FIRST
config()


// Now import prisma after env vars are loaded
import { prisma } from '../../database/server/utils/prisma-client'

// Import utility functions from the seed layer
import { updateLocationsByAddressListForSeed } from '../server/utils/location-for-seed'
import { generateProperty } from '../server/utils/property-faker'
import { generateSaleListing, generateRentalListing } from '../server/utils/listing-faker'
import { seedFakeUsers } from '../server/utils/user-faker'
import { rentalAddress, saleAddress, cityCenters } from '../server/utils/address-to-seed'

/**
 * Seeding function to populate property types and classifications in the database.
 */
async function seedPropertyTypes() {
  const types = {
    House: ['Terraced', 'Semi-detached', 'End of Terrace', 'Detached', 'Mansion'],
    Cottage: ['Terraced', 'Detached', 'Semi-detached', 'End of Terrace'],
    Bungalow: ['Terraced', 'Semi-detached', 'End of Terrace', 'Detached'],
    Flat: ['Converted', 'Studio', 'Maisonette', 'High-rise', 'Within a Complex', 'Penthouse'],
    Land: ['Residential', 'Commercial', 'Agricultural', 'Development Plot', 'Development Potential'],
    Farms: ['Non-working Farmhouse', 'Working', 'Small Holding'],
    Specialty: ['Shared Ownership', 'Retirement Home', 'New Build Home'],
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
      console.log(`Seeded category '${typeName}'.`)
    }
    else if (classification.length === 0) {
      console.log(`Seeded category '${typeName}' with no subtypes.`)
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
      },
    })
    console.log('Admin user created.')
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
          street_city_postcode_country: {
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
  console.log('City centers seeded.')
}

async function seedDatabase() {
  try {
    console.log('Running database seeder...')

    await seedAdminUser()
    await seedCityCenters()
    await seedPropertyTypes()

    console.log('Seeding properties and listings...')
    
    // Generate properties and listings in parallel batches
    await Promise.all([
      // Sale properties and listings
      (async () => {
        const saleProperties = await Promise.all(
          saleAddress.map(addr => generateProperty(addr))
        )
        await Promise.all(
          saleProperties.map(prop => generateSaleListing(prop.id))
        )
      })(),
      
      // Rental properties and listings  
      (async () => {
        const rentalProperties = await Promise.all(
          rentalAddress.map(addr => generateProperty(addr))
        )
        await Promise.all(
          rentalProperties.map(prop => generateRentalListing(prop.id))
        )
      })()
    ])
    
    console.log('Properties and listings seeded.')

    console.log('Seeding fake users...')
    await seedFakeUsers(20)
    console.log('Fake users seeded.')

    console.log('Database seeding complete.')
  }
  catch (e: any) {
    console.error('Error during database seeding:', e)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
  }
}

seedDatabase()