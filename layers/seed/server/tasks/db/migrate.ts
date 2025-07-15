import { defineTask } from 'nitropack/runtime/task'
import { execa } from 'execa'

export default defineTask({
  meta: {
    name: 'db:migrate',
    description: 'Run database migrations',
  },
  async run({ payload, context }) {
    try {
      console.log('Running database migrations...')
      await execa('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' })
      console.log('Database migrations complete.')
      return {
        result: 'Database migrations complete.',
      }
    }
    catch (e: any) {
      console.error('Error during database migrations', e)
      throw new Error('Database migrations failed.', { cause: e })
    }
  },
})
