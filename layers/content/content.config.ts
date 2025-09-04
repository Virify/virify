import { defineContentConfig, defineCollection } from '@nuxt/content'
import path from 'path'

export default defineContentConfig({
  collections: {
    guides: defineCollection({
      type: 'page',
      source: {
        cwd: path.resolve('./layers/content/app/pages/guides'),
        include: '**/*.md',
      }
    })
  }
})