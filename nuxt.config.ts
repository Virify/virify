// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  extends: ['./layers/email'],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["nuxt-auth-utils", "@nuxt/ui", "@nuxtjs/leaflet"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "leaflet/dist/leaflet.css"],
  ui: {
    theme: {
      colors: ["primary", "secondary", "accent", "info", "success", "warning", "error", "bg"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    experimental: {
      openAPI: true,
      tasks: true,
    },
    imports: {
      dirs: ["server/database/lib/*.ts"],
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
  runtimeConfig: {
    public: {
      redirectCookieName: "redirect",
      loginUrl: "/login",
      NOMINATIM_API_URL: process.env.NOMINATIM_API_URL,
      NUXT_SESSION_PASSWORD: process.env.NUXT_SESSION_PASSWORD,
    },
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
