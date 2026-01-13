import { defineNuxtModule } from '@nuxt/kit';
import { validateConfig } from './icons/config/validate-config';
import { checkIsWatched } from './icons/filesystem/check-is-watched'
import { generateSprites } from './icons/generate-sprites'
import { consola } from 'consola'

export default defineNuxtModule({
  meta: {
    name: 'Icons',
    configKey: 'icons'
  },
  setup(options, nuxt) {
    try {
      const { input, output } = validateConfig(options, nuxt.options.alias)

      nuxt.hook('build:before', () => {
        generateSprites(input, output)
      })

      nuxt.hook('builder:watch', (_, fileName) => {
        if (!checkIsWatched(fileName, input)) return

        generateSprites(input, output)
      })
    }
    catch (err) {
      consola.error(err)
    }
  }
})
