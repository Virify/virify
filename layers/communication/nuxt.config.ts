export default defineNuxtConfig({
  nitro: {
    experimental: {
      websocket: true
    },
  },
  runtimeConfig: {
    public: {
      WS_BASE_URL: process.env.WS_BASE_URL || process.env.PREVIEW_WS_BASE_URL,
    }
  }
});