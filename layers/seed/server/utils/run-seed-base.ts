#!/usr/bin/env tsx
/**
 * Base seed for production - only seeds essential data
 * Usage: pnpm db:seed:base
 */

import { config } from 'dotenv'
config()

import { prisma } from '../../../database/server/utils/prisma-client'
import { MembershipType } from "../../../database/server/database/prisma/generated/enums"

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

async function seedBaseData() {
  try {
    console.log('🌱 Running base database seeder (production)...')

    await seedAdminUser()
    await seedPropertyTypes()

    console.log('✅ Base database seeding complete.')
    process.exit(0)
  }
  catch (e: any) {
    console.error('❌ Error during base database seeding:', e)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
  }
}

seedBaseData()
