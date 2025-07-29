#!/usr/bin/env tsx

import { execa } from 'execa'

async function migrateDatabase() {
  try {
    console.log('Running database migration...')
    await execa('npx', ['prisma', 'migrate', 'dev'], { stdio: 'inherit' })
    console.log('Database migration complete.')
  }
  catch (e: any) {
    console.error('Error during database migration:', e)
    process.exit(1)
  }
}

migrateDatabase()