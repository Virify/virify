import 'dotenv/config'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'


export default defineConfig({
  // Load all .prisma files in this folder and its subfolders
  schema: path.join(__dirname),
  datasource: {
    // keep the main DATABASE_URL here for the primary schema
    url: env('DATABASE_URL')
  }
})