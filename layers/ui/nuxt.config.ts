import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({


  // Global styles
  css: [
    './layers/ui/app/assets/styles/main.scss',
    './layers/ui/app/assets/styles/tailwind.css',
  ],

  // Alias for referencing styles
  alias: {
    '#styles': fileURLToPath(new URL('./app/assets/styles', import.meta.url))
  },

  // Modules
  modules: [
    '@nuxtjs/fontaine',
    './layers/ui/app/modules/icons.ts',
    '@nuxt/ui',
  ],

  // Fonts
  fontMetrics: {
    fonts: ['Be Vietnam Pro']
  },

  // Sprite icons
  icons: {
    input: ['./layers/ui/app/assets/sprites'],
    output: './public/sprites'
  },

});