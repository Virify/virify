export default defineNuxtConfig({
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    PPD_DATABASE_URL: process.env.PPD_DATABASE_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  },
});