export default defineNuxtConfig({
  nitro: {
    experimental: {
      websocket: true
    },
  },
  runtimeConfig: {
    public: {
      WS_BASE_URL: process.env.RAILWAY_PUBLIC_DOMAIN ? 'wss://' + process.env.RAILWAY_PUBLIC_DOMAIN : process.env.WS_BASE_URL,
    }
  }
});