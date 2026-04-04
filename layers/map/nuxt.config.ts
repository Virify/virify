export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
      EASYPOSTCODES_KEY: process.env.EASYPOSTCODES_KEY,
    },
  },
});
