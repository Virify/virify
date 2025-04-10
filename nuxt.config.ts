// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ["nuxt-auth-utils", "nuxt-nodemailer", "@nuxt/ui", "@nuxtjs/leaflet"],
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
      // This will default to the preview email service via build and will be overridden by branch deploys
      EMAIL_BASE_URL: process.env.EMAIL_BASE_URL || process.env.PREVIEW_EMAIL_BASE_URL,
      INTERNAL_EMAIL: process.env.INTERNAL_EMAIL,
    },
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  nodemailer: {
    from: '"Virify" <no-reply@virify.co.uk>',
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
});
