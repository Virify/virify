import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics", "./layers/websocket", "./layers/seed", "./layers/content"],
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/image", "nuxt-security"],
  image: {
    cloudflare: {
      baseURL: process.env.CF_IMAGES_URL,
    },
  },
  security: {
    xssValidator: {
      methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
      escapeHtml: true,
    },
    headers: {
      permissionsPolicy: false,
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "https://cdn.sanity.io", "https://virify.co.uk", String(process.env.CF_IMAGES_URL), "https://images.unsplash.com"],
        "script-src": ["'self'", "https:", "'unsafe-inline'"],
        "script-src-attr": ["'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", 'https:'],
        "worker-src": ["'self'", "blob:"],
      },
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
