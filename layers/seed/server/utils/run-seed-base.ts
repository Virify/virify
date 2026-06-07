#!/usr/bin/env tsx
/**
 * Base seed for production - only seeds essential data
 * Usage: pnpm db:seed:base
 */

import { config } from 'dotenv'
config()

import { prisma } from '../../../database/server/utils/prisma-client'
import { MembershipType } from "../../../database/server/database/prisma/generated/enums"
import { seedPropertyTypes } from './seed-property-types'

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

async function seedBaseData() {
  try {
    console.log('🌱 Running base database seeder (production)...')

    await seedAdminUser()
    await seedPropertyTypes(prisma)

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
