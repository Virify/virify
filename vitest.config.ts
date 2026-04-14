import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./tests/setup/nuxt.ts'],
    // exclude: ['**/node_modules/**', 'tests/integration/ai-search.test.ts'],
    exclude: ['**/node_modules/**'],
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
        overrides: {
          ssr: false,
          // @ts-ignore
          image: {
            provider: 'none'
          }
        },
        mock: {
          intersectionObserver: true,
        },
      },
    },
  },
})
