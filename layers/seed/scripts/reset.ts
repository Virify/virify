#!/usr/bin/env tsx

import { execa } from 'execa'

async function resetDatabase() {
  try {
    console.log('Resetting database...')
    await execa('npx', ['prisma', 'migrate', 'reset', '--force'], { stdio: 'inherit' })
    console.log('Database reset complete.')
  }
  catch (e: any) {
    console.error('Error during database reset:', e)
    process.exit(1)
  }
}

resetDatabase()