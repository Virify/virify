import { SES } from "@aws-sdk/client-ses";

export default defineEventHandler(() => {
  const config = useRuntimeConfig();

  return {
    emailBaseUrl: config.public.EMAIL_BASE_URL,
    internalEmail: config.public.INTERNAL_EMAIL,
    SES_ACCESS_KEY_ID: config.SES_ACCESS_KEY_ID,
    SES_SECRET_ACCESS_KEY: config.SES_SECRET_ACCESS_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  };
});