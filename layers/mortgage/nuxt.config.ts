import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  imports: {
    dirs: ['server/tasks/**'],
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Run on the 1st of every month at 9am UTC
      '0 9 1 * *': ['mortgage:fetch-rates'],
    },
  },
})
