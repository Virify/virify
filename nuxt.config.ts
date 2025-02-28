// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue'
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxtjs/tailwindcss", "nuxt-auth-utils", "nuxt-nodemailer"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
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
      plugins: [vue()]
    },
  },
  runtimeConfig: {
    oauth: {
      // provider in lowercase (github, google, etc.)
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
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
