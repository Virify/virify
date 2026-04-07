export default defineNuxtConfig({
  runtimeConfig: {
    CF_SECRET_KEY: process.env.CF_SECRET_KEY,
    CF_IMAGES_API_KEY: process.env.CF_IMAGES_API_KEY,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH,
    CF_SERVICE_TOKEN_ID: process.env.CF_SERVICE_TOKEN_ID,
    CF_SERVICE_TOKEN_SECRET: process.env.CF_SERVICE_TOKEN_SECRET,
    CF_R2_TOKEN: process.env.CF_R2_TOKEN,
    CF_R2_BUCKET: process.env.CF_R2_BUCKET,
    CF_ACCESS_KEY: process.env.CF_ACCESS_KEY,
    CF_SECRET_ACCESS_KEY: process.env.CF_SECRET_ACCESS_KEY,
    public: {
      CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH,
      CF_SITE_KEY: process.env.CF_SITE_KEY,
      CF_R2_URL: process.env.CF_R2_URL,
    },
  },
});
