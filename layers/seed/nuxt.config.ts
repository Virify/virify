import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  imports: {
    dirs: ['server/scripts', 'server/tasks'],
  }
})
