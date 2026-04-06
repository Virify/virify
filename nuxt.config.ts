import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics", "./layers/websocket", "./layers/seed", "./layers/content", './layers/sanity', './layers/dashboard'],
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    CF_SECRET_KEY: process.env.CF_SECRET_KEY,
    CF_IMAGES_API_KEY: process.env.CF_IMAGES_API_KEY,
    CF_ACCOUNT_ID: process.env.CF_ACCOUNT_ID,
    CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH,
    CF_SERVICE_TOKEN_ID: process.env.CF_SERVICE_TOKEN_ID,
    CF_SERVICE_TOKEN_SECRET: process.env.CF_SERVICE_TOKEN_SECRET,
    public: {
      isWaitingList: process.env.DEPLOYMENT_ENV === 'waiting-list',
      CF_SITE_KEY: process.env.CF_SITE_KEY,
      CF_ACCOUNT_HASH: process.env.CF_ACCOUNT_HASH, // Needed for image URLs on client
    },
  },
  modules: ["@nuxt/image", "nuxt-security", "@nuxtjs/seo", "@nuxtjs/sanity"],

  // Nuxt SEO Configuration
  site: {
    url: 'https://virify.co.uk',
    name: 'Virify',
    description: 'The UK\'s first open property marketplace. AI-powered property search and verified private listings.',
    defaultLocale: 'en-GB',
    indexable: process.env.SANITY_PREVIEW !== 'true',
  },

  // Schema.org structured data
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Virify',
      url: 'https://virify.co.uk',
      logo: 'https://virify.co.uk/logo.png',
      sameAs: [
        // Add your social media URLs when available
        // 'https://twitter.com/virifyuk',
        // 'https://linkedin.com/company/virify'
      ],
    }
  },

  // Robots configuration
  robots: {
    allow: [
      '/',
      // '/mortgage-calculator',
      '/price-paid',
      '/contact',
      '/guides',
      '/guides/*',
      '/privacy',
      '/terms',
      '/cookie',
      '/support',
      '/listing/*',
    ],
    disallow: [
      '/account',
      '/account/*',
      '/dashboard',
      '/dashboard/*',
      '/api',
      '/api/*',
      '/auth/update-admin-password',
      '/listing/preview',
      '/listing/preview/*',
      '/search',
      '/ai-search',
    ],
  },
  // Sitemap configuration
  sitemap: {
    exclude: [
      '/email-preview-tool/**',
      '/password/**',
      '/signup/verify',
      '/map-search',
      '/pre-dock',
      '/sandbox',
      '/login',
      '/signup',
      '/account/**',
      '/listing/**',
      '/search/**',
      '/ai-search/**',
      '/review/**',
      '/auth/update-admin-password',
    ],
    sources: [
      '/api/__sitemap__/guides',
    ],
  },
  image: {
    cloudflare: {
      baseURL: process.env.CF_IMAGES_URL,
    },
  },
  security: {
    enabled: true,
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 60000,
      throwError: false,
    },
    xssValidator: {
      methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
      escapeHtml: true,
    },
    headers: {
      permissionsPolicy: false,
      contentSecurityPolicy: false,
      xFrameOptions: 'SAMEORIGIN',
    },
    nonce: false,
    sri: false,
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2_000_000,
      maxUploadFileRequestInBytes: 10_000_000,
      throwError: true,
    },
  },
  routeRules: {
    '/waiting-list': {
      redirect: '/',
    },
    // Tight rate limits on high-value auth endpoints to prevent brute-force
    '/auth/login': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 60000, throwError: false } },
    },
    '/auth/verify-otp': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 300000, throwError: false } },
    },
    '/auth/password-reset': {
      security: { rateLimiter: { tokensPerInterval: 3, interval: 300000, throwError: false } },
    },
  },
  compatibilityDate: "2025-07-09",
  devtools: { enabled: true },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
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
      asyncContext: true,
      tasks: true,
    },
    scheduledTasks: {
      // Run mortgage rate fetch on the 1st of every month at 9am UTC
      '0 9 1 * *': ['mortgage:fetch-rates'],
    },
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
  // Only show sourcemap for dev mode
  sourcemap: {
    server: import.meta.dev,
    client: import.meta.dev
  }
});
