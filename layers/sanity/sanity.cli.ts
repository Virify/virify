import {defineCliConfig} from 'sanity/cli'
import dotenv from "dotenv";
import path from "path";

// Load .env from project root (two levels up from layers/sanity)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
