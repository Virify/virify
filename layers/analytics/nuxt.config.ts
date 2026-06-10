// Nuxt configuration for the analytics layer
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["nuxt-gtag"],
  gtag: {
    id: process.env.G_TAG,
    initCommands: [
      // Set default consent to denied before GA loads
      [
        "consent",
        "default",
        {
          analytics_storage: "denied",
          ad_storage: "denied",
          wait_for_update: 500,
        },
      ],
    ],
  },
});
