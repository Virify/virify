export default defineNuxtConfig({

  // Global styles
  css: ['./layers/ui/assets/styles/main.scss'],

  // Modules
  modules: [
    '@nuxtjs/fontaine',
    './layers/ui/modules/icons.ts'
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