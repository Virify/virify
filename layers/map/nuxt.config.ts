export default defineNuxtConfig({
  runtimeConfig: {
    easyPostcodeAPI: process.env.EASYPOSTCODES_KEY,
    public: {
      MAPTILER_API_KEY: process.env.MAPTILER_API_KEY,
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },
});
