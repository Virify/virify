import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import dotenv from "dotenv";
import path from "path";

// Load .env from project root (two levels up from layers/sanity)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  name: 'default',
  title: 'Virify',

  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
