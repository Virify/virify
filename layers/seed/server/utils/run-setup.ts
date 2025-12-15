#!/usr/bin/env tsx
/**
 * Unified setup script that runs everything in order
 * Usage: pnpm db:setup
 * 
 * For production: pnpm db:setup:prod
 * For staging/demo: pnpm db:setup:full
 */

import { execa } from 'execa'

const isProduction = process.argv.includes('--prod')
const seedCommand = isProduction ? 'db:seed:base' : 'db:seed:full'

async function runSetup() {
  try {
    console.log(`🚀 Running ${isProduction ? 'production' : 'staging/demo'} setup...\n`)

    // Step 1: Reset database
    console.log('1️⃣  Resetting database...')
    await execa('pnpm', ['db:reset'], { stdio: 'inherit' })
    console.log('✅ Database reset complete\n')

    // Step 2: Seed database
    console.log(`2️⃣  Seeding database (${isProduction ? 'base' : 'full'})...`)
    await execa('pnpm', [seedCommand], { stdio: 'inherit' })
    console.log('✅ Database seed complete\n')

    // Step 3: Update admin password
    console.log('3️⃣  Updating admin password...')
    await execa('pnpm', ['db:update-admin-password'], { stdio: 'inherit' })
    console.log('✅ Admin password updated\n')

    // Step 4: Fetch mortgage rates
    console.log('4️⃣  Fetching mortgage rates...')
    await execa('pnpm', ['db:fetch-rates'], { stdio: 'inherit' })
    console.log('✅ Mortgage rates fetched\n')

    console.log('🎉 Setup complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

runSetup()
