export default defineNuxtConfig({
  runtimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  imports: {
    dirs: [
      "~~/layers/database/server/utils/*.ts",     
      '~~/layers/database/server/database/lib/prisma.ts', 
    ],
  },
});