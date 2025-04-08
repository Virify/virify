export default defineEventHandler(() => {
  return {
    emailUser: process.env.EMAIL_USER,
    emailHost: process.env.EMAIL_HOST,
    emailPass: process.env.EMAIL_PASS,
    emailBaseUrl: process.env.EMAIL_BASE_URL,
    internalEmail: process.env.INTERNAL_EMAIL,
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    nominatimApiUrl: process.env.NOMINATIM_API_URL,
    databaseUrl: process.env.DATABASE_URL,
  }
})