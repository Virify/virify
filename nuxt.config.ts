import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  extends: [
    "./layers/ui",
    "./layers/email",
    "./layers/database",
    './layers/auth'
  ],

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxtjs/leaflet", "@nuxt/image"],

  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  css: ["leaflet/dist/leaflet.css"],

  nitro: {
    experimental: {
      openAPI: true,
      tasks: true,
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    }
  },

  runtimeConfig: {
    public: {
      NOMINATIM_API_URL: process.env.NOMINATIM_API_URL,
    },
  },
});