import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
        overrides: {
          ssr: false,
          // @ts-ignore
          image: {
            provider: 'none'
          }
        }
      },
    },
    setupFiles: ['./.storybook/vitest.setup.ts'],
    include: [
      'stories/**/*.test.ts',
      'stories/**/*.spec.ts',
      'layers/**/*.test.ts',
      'layers/**/*.spec.ts',
    ],
  },
})
