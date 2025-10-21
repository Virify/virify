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
           initial: 'https://virify.co.uk',
           // Use the explicit env var when provided (set this in your Studio deployment).
           // Fall back to the public staging site so the Presentation Tool doesn't default to localhost.
           origin: 'https://virify.co.uk',
           previewMode: {
             enable: '/api/preview/enable',
             disable: '/api/preview/disable',
           },
         },
       }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
