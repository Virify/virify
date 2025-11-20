#!/usr/bin/env tsx

import { execa } from 'execa'

async function resetDatabase() {
  try {
    console.log('Resetting database...')
    // Reset only the main database using the project-level Prisma config
    // Use `pnpm exec` so the local Prisma binary and TypeScript config are resolved correctly
    await execa('pnpm', ['exec', 'prisma', 'migrate', 'reset', '--config=./layers/database/server/database/prisma/prisma.config.ts', '--force'], { stdio: 'inherit' })
    console.log('Database reset complete.')
  }
  catch (e: any) {
    console.error('Error during database reset:', e)
    process.exit(1)
  }
}

resetDatabase()