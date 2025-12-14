import { execa } from 'execa'

/**
 * Nitro task to reset the database
 * ⚠️ WARNING: This will DROP all data and reapply migrations!
 * 
 * Can be triggered via:
 * - CLI: npx nitro task run db:reset
 * - GitHub Action: task: reset
 * - API: POST /api/_nitro/tasks/db:reset (if enabled)
 */
export default defineTask({
  meta: {
    name: 'db:reset',
    description: 'Resets the database by dropping all data and reapplying migrations (⚠️ DESTRUCTIVE)',
  },
  async run() {
    console.log('[DB Reset] ⚠️ Starting database reset...')
    console.log('[DB Reset] This will DROP all data and reapply migrations!')
    
    try {
      // Reset the main database using prisma migrate reset
      await execa('pnpm', [
        'exec', 
        'prisma', 
        'migrate', 
        'reset',
        '--config=./layers/database/server/database/prisma/prisma.config.ts',
        '--force'
      ], {
        stdio: 'inherit',
        env: {
          ...process.env,
        },
      })
      
      console.log('[DB Reset] ✅ Database reset complete!')
      
      return { result: 'success' }
    } catch (error: any) {
      console.error('[DB Reset] ❌ Error during reset:', error.message)
      throw error
    }
  },
})
