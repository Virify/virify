import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Virify',
  projectId: 'zl7h47m2',
  dataset: 'production',
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/preview/enable',
          disable: '/api/preview/disable',
        },
      },
      allowOrigins: ['http://localhost:3000', 'https://virify.co.uk'],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
