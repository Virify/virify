import { defineTask } from 'nitropack/runtime/task'
import { execa } from 'execa'

export default defineTask({
  meta: {
    name: 'db:reset',
    description: 'Reset the database',
  },
  async run({ payload, context }) {
    try {
      console.log('Resetting database...')
      await execa('npx', ['prisma', 'migrate', 'reset', '--force'], { stdio: 'inherit' })
      await execa('npx', ['prisma', 'generate'], { stdio: 'inherit' })
      console.log('Database reset complete.')
      return {
        result: 'Database reset complete.',
      }
    }
    catch (e: any) {
      console.error('Error during database reset:', e)
      throw new Error('Database reset failed.', { cause: e })
    }
  },
})
