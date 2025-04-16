export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      EMAIL_BASE_URL: process.env.EMAIL_BASE_URL || process.env.PREVIEW_EMAIL_BASE_URL,
      INTERNAL_EMAIL: process.env.INTERNAL_EMAIL,
    },
    SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID,
    SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
  },
  imports: {
    dirs: [
      "server/**",
      "server/email/**",
      "server/utils/**",
    ],
  },
});