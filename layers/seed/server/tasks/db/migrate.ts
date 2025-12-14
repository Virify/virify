import { execa } from 'execa'
import { defineTask } from 'nitropack/runtime'

/**
 * Nitro task to run database migrations (dev mode)
 * 
 * Can be triggered via:
 * - CLI: npx nitro task run db:migrate
 */
export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Runs Prisma database migrations (migrate dev)',
  },
  async run() {
    console.log('[DB Migrate] Running database migrations...')

    try {
      await execa('pnpm', [
        'exec',
        'prisma',
        'migrate',
        'dev',
        '--config=./layers/database/server/database/prisma/prisma.config.ts',
      ], {
        stdio: 'inherit',
        env: {
          ...process.env,
        },
      })

      console.log('[DB Migrate] ✅ Migrations complete!')

      return { result: 'success' }
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[DB Migrate] ❌ Error:', message)
      throw error
    }
  },
})
