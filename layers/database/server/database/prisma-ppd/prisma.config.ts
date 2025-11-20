import 'dotenv/config'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // point at this schema file/folder so CLI commands run in this dir pick it up
  schema: path.join(__dirname),
  datasource: {
    url: env('PPD_DATABASE_URL')
  }
})
