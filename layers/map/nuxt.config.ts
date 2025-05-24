export default defineNuxtConfig({
  css: ["@maptiler/sdk/dist/maptiler-sdk.css"],
  runtimeConfig: {
    public: {
      MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },
});
