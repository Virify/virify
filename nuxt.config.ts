// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ["nuxt-auth-utils", "nuxt-nodemailer", '@nuxt/ui'],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ui: {
    colorMode: false
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
      plugins: [vue()]
    },
  },
  runtimeConfig: {
    public: {
      redirectCookieName: "redirect",
      loginUrl: "/login",
    },
    
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
