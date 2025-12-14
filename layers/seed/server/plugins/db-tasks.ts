import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { defineNitroPlugin, runTask } from 'nitropack/runtime'

const execAsync = promisify(exec)

/**
 * Nitro plugin: Run migrations on startup, seed if any were applied
 */
export default defineNitroPlugin(async () => {

  try {
    const { stdout } = await execAsync('pnpm migrate-deploy')
    console.log('[Startup] 🔄 Running prisma migrate deploy...')
    console.log(stdout)

    // If migrations were applied, run reset and seed tasks
    if (!stdout.includes('No pending migrations to apply')) {
      console.log('[Startup] ✅ Migrations applied! Running tasks...')

      for (const task of ['db:reset', 'db:seed', 'mortgage:fetch-rates']) {
        console.log(`[Startup] 🚀 Running: ${task}`)
        try {
          const result = await runTask(task)
          console.log(`[Startup] ✅ Done: ${task}`, result)
        }
        catch (error) {
          console.error(`[Startup] ❌ Failed: ${task}`, error)
        }
      }
    }
    else {
      console.log('[Startup] ℹ️ No migrations applied.')
    }
  }
  catch (error) {
    console.error('[Startup] ❌ Migration failed:', error)
  }
})
