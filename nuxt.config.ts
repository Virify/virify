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
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=overlays-content" },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#0F0F25' },
        { name: 'application-name', content: 'Virify' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Virify' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: "/favicon.svg" },
        { rel: 'icon', type: 'image/png', sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: 'icon', type: 'image/png', sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: 'icon', type: 'image/png', sizes: "48x48", href: "/favicon-48x48.png" },
        { rel: 'manifest', href: "/manifest.json" },
        { rel: 'apple-touch-icon', sizes: "57x57", href: "/apple-touch-icon-57x57.png" },
        { rel: 'apple-touch-icon', sizes: "60x60", href: "/apple-touch-icon-60x60.png" },
        { rel: 'apple-touch-icon', sizes: "72x72", href: "/apple-touch-icon-72x72.png" },
        { rel: 'apple-touch-icon', sizes: "76x76", href: "/apple-touch-icon-76x76.png" },
        { rel: 'apple-touch-icon', sizes: "114x114", href: "/apple-touch-icon-114x114.png" },
        { rel: 'apple-touch-icon', sizes: "120x120", href: "/apple-touch-icon-120x120.png" },
        { rel: 'apple-touch-icon', sizes: "144x144", href: "/apple-touch-icon-144x144.png" },
        { rel: 'apple-touch-icon', sizes: "152x152", href: "/apple-touch-icon-152x152.png" },
        { rel: 'apple-touch-icon', sizes: "167x167", href: "/apple-touch-icon-167x167.png" },
        { rel: 'apple-touch-icon', sizes: "180x180", href: "/apple-touch-icon-180x180.png" },
        { rel: 'apple-touch-icon', sizes: "1024x1024", href: "/apple-touch-icon-1024x1024.png" },
      ]
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
