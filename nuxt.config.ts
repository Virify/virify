// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from "@vitejs/plugin-vue";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxtjs/tailwindcss", "nuxt-auth-utils", "nuxt-nodemailer", "@formkit/nuxt"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
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
  formkit: {
    autoImport: true,
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
