import { execa } from 'execa'
import { defineTask } from 'nitropack/runtime'

/**
 * Nitro task to reset the database
 * ⚠️ WARNING: This will DROP all data and reapply migrations!
 * 
 * Can be triggered via:
 * - CLI: npx nitro task run db:reset
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
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[DB Reset] ❌ Error:', message)
      throw error
    }
  },
})
