import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({


  // Global styles
  css: [
    './layers/ui/assets/styles/main.scss',
    './layers/ui/assets/styles/tailwind.css',
  ],

  // Alias for referencing styles
  alias: {
    '#styles': fileURLToPath(new URL('./assets/styles', import.meta.url))
  },

  // Modules
  modules: [
    '@nuxtjs/fontaine',
    './layers/ui/modules/icons.ts',
    '@nuxt/ui',
  ],

  // Fonts
  fontMetrics: {
    fonts: ['Be Vietnam Pro']
  },

  // Sprite icons
  icons: {
    input: ['./layers/ui/assets/sprites'],
    output: './public/sprites'
  },

});