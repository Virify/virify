import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics", "./layers/websocket", "./layers/seed", "./layers/content"],
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    CF_SECRET_KEY: process.env.CF_SECRET_KEY,
    CF_IMAGES_API_KEY: process.env.CF_IMAGES_API_KEY,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH,
    public: {
      CF_SITE_KEY: process.env.CF_SITE_KEY,
      CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH, // Needed for image URLs on client
    },
  },
  modules: ["@nuxt/image", "nuxt-security"],
  image: {
    cloudflare: {
      baseURL: process.env.CF_IMAGES_URL,
    },
  },
  security: {
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 60000, // 1 minute
      throwError: false, // Optional: don't throw error, just block
    },
    xssValidator: {
      methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
      escapeHtml: true,
    },
    headers: {
      permissionsPolicy: false,
      contentSecurityPolicy: false,
    },
    nonce: false,
    sri: false,
    requestSizeLimiter: false,
  },
  compatibilityDate: "2025-07-09",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      meta: [{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=overlays-content" }],
    },
    // pageTransition: { name: "page", mode: "out-in" },
    // layoutTransition: { name: "page", mode: "in-out" },
  },
  vite: {
    plugins: [],
    vue: {
      template: {
        compilerOptions: {
          comments: false,
        },
      },
    },
  },
  nitro: {
    experimental: {
      tasks: true,
      asyncContext: true,
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
});
