import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  extends: ["./layers/ui", "./layers/email", "./layers/database", "./layers/auth", "./layers/map", "./layers/analytics", "./layers/websocket", "./layers/seed", "./layers/content", "./layers/estate-agent-site"],
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
      '/price-paid',
      '/contact',
      '/guides',
      '/guides/*',
      '/privacy',
      '/terms',
    ],
    disallow: [
      '/account',
      '/account/*',
      '/api',
      '/api/*',
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
      xFrameOptions: false,
    },
    nonce: false,
    sri: false,
    requestSizeLimiter: false,
  },
  routeRules: {
    '/waiting-list': {
      redirect: '/',
    }
  },
  compatibilityDate: "2025-07-09",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
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
