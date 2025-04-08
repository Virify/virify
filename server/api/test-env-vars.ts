export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  return {
    emailUser: config.public.EMAIL_USER,
    emailHost: config.public.EMAIL_HOST,
    emailPass: config.EMAIL_PASS,
    emailBaseUrl: config.public.EMAIL_BASE_URL,
    internalEmail: config.public.INTERNAL_EMAIL,
    sessionPassword: config.public.NUXT_SESSION_PASSWORD,
    nominatimApiUrl: config.public.NOMINATIM_API_URL,
    databaseUrl: config.DATABASE_URL,
  }
})