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
    console.log(`Running ${isProduction ? 'production' : 'staging/demo'} setup...\n`)

    // Step 1: Reset database
    console.log('Step 1: Resetting database...')
    await execa('pnpm', ['db:reset'], { stdio: 'inherit' })
    console.log('Database reset complete\n')

    // Step 2: Flush Redis cache (skipped if no Redis configured, e.g. local dev without Redis)
    console.log('Step 2: Flushing Redis cache...')
    if (process.env.REDIS_PUBLIC_URL || process.env.REDIS_URL || process.env.REDISHOST) {
      await execa('pnpm', ['redis:flush'], { stdio: 'inherit' })
      console.log('Redis flushed\n')
    } else {
      console.log('Skipped (no Redis connection configured)\n')
    }

    // Step 3: Seed database
    console.log(`Step 3: Seeding database (${isProduction ? 'base' : 'full'})...`)
    await execa('pnpm', [seedCommand], { stdio: 'inherit' })
    console.log('Database seed complete\n')

    // Step 4: Update admin password
    console.log('Step 4: Updating admin password...')
    await execa('pnpm', ['db:update-admin-password'], { stdio: 'inherit' })
    console.log('Admin password updated\n')

    // Step 5: Fetch mortgage rates
    console.log('Step 5: Fetching mortgage rates...')
    await execa('pnpm', ['db:fetch-rates'], { stdio: 'inherit' })
    console.log('Mortgage rates fetched\n')

    console.log('Setup complete!')
    process.exit(0)
  } catch (error: any) {
    console.error('Setup failed:', error.message)
    process.exit(1)
  }
}

runSetup()
