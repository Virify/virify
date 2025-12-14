import { execa } from 'execa'

/**
 * Nitro task to run database migrations
 * Can be triggered via:
 * - CLI: npx nitro task run db:migrate
 * - GitHub Action: task: migrate
 * - API: POST /api/_nitro/tasks/db:migrate (if enabled)
 */
export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Runs Prisma database migrations (migrate dev)',
  },
  async run() {
    console.log('[DB Migrate] Starting database migration...')
    
    try {
      // Run prisma migrate dev for the main database
      await execa('pnpm', ['exec', 'prisma', 'migrate', 'dev', '--config=./layers/database/server/database/prisma/prisma.config.ts'], {
        stdio: 'inherit',
        env: {
          ...process.env,
        },
      })
      
      console.log('[DB Migrate] ✅ Database migration complete!')
      
      return { result: 'success' }
    } catch (error: any) {
      console.error('[DB Migrate] ❌ Error during migration:', error.message)
      throw error
    }
  },
})
