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
  },
})
