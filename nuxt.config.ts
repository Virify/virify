// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
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
      dirs: ["server/database/lib/*.ts", "/server/email/*.ts"],
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
      // TODO: I can get the base URL from the request, so I don't need to set this
      EMAIL_BASE_URL: process.env.EMAIL_BASE_URL || process.env.PREVIEW_EMAIL_BASE_URL,
      INTERNAL_EMAIL: process.env.INTERNAL_EMAIL,
    },
    DATABASE_URL: process.env.DATABASE_URL,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
