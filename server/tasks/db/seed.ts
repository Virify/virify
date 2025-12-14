import { prisma } from '~~/layers/database/server/utils/prisma-client'
import { MembershipType } from '~~/layers/database/server/database/prisma/generated/enums'
import { updateLocationsByAddressListForSeed } from '~~/layers/seed/server/utils/location-for-seed'
import { generateProperty } from '~~/layers/seed/server/utils/property-faker'
import { generateSaleListing, generateRentalListing } from '~~/layers/seed/server/utils/listing-faker'
import { seedFakeUsers } from '~~/layers/seed/server/utils/user-faker'
import { rentalAddress, saleAddress, cityCenters } from '~~/layers/seed/server/utils/address-to-seed'
import { seedAdminFavourites } from '~~/layers/seed/server/utils/admin-favourites-seed'

/**
 * Nitro task to seed the database with initial data
 * Can be triggered via:
 * - CLI: npx nitro task run db:seed
 * - GitHub Action: task: seed
 * - API: POST /api/_nitro/tasks/db:seed (if enabled)
 */
export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seeds the database with property types, admin user, sample properties and listings',
  },
  async run() {
    const config = useRuntimeConfig()
    
    console.log('[DB Seed] Starting database seeding...')
    
    try {
      // Seed admin user
      await seedAdminUser(config)
      
      // Seed city centers
      await seedCityCenters()
      
      // Seed property types
      await seedPropertyTypes()
      
      // Seed properties and listings
      await seedPropertiesAndListings()
      
      // Seed fake users
      console.log('[DB Seed] Seeding fake users...')
      await seedFakeUsers(20)
      console.log('[DB Seed] Fake users seeded.')
      
      // Seed admin favourites
      console.log('[DB Seed] Seeding admin favourites...')
      await seedAdminFavourites()
      console.log('[DB Seed] Admin favourites seeded.')
      
      console.log('[DB Seed] ✅ Database seeding complete!')
      
      return { result: 'success' }
    } catch (error: any) {
      console.error('[DB Seed] ❌ Error during seeding:', error)
      throw error
    }
  },
})

/**
 * Seed property types and classifications
 */
async function seedPropertyTypes() {
  console.log('[DB Seed] Seeding property types...')
  
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
      console.log(`[DB Seed] Seeded category '${typeName}'.`)
    }
  }
  
  console.log('[DB Seed] Property types seeded.')
}

/**
 * Seed admin user
 */
async function seedAdminUser(config: any) {
  console.log('[DB Seed] Seeding admin user...')
  
  const adminEmail = process.env.ADMIN_EMAIL
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        username: process.env.ADMIN_USERNAME,
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
    console.log('[DB Seed] Admin user created.')
  } else {
    console.log('[DB Seed] Admin user already exists.')
  }
}

/**
 * Seed city center addresses
 */
async function seedCityCenters() {
  console.log('[DB Seed] Seeding city centers...')
  
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
  
  console.log('[DB Seed] City centers seeded.')
}

/**
 * Seed properties and listings
 */
async function seedPropertiesAndListings() {
  console.log('[DB Seed] Seeding properties and listings...')
  
  await Promise.all([
    // Sale properties and listings
    (async () => {
      const saleProperties = await Promise.all(
        saleAddress.map(addr => generateProperty(addr))
      )
      await Promise.all(
        saleProperties.map((prop: { id: number }) => generateSaleListing(prop.id))
      )
    })(),
    
    // Rental properties and listings
    (async () => {
      const rentalProperties = await Promise.all(
        rentalAddress.map(addr => generateProperty(addr))
      )
      await Promise.all(
        rentalProperties.map((prop: { id: number }) => generateRentalListing(prop.id))
      )
    })()
  ])
  
  console.log('[DB Seed] Properties and listings seeded.')
}
