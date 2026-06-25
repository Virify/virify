// Nuxt configuration for the analytics layer
import { defineNuxtConfig } from "nuxt/config";

const gtagId = process.env.NUXT_PUBLIC_GTAG_ID || process.env.G_TAG;

export default defineNuxtConfig({
  modules: ["nuxt-gtag"],
  gtag: {
    enabled: process.env.NODE_ENV === "production" && !!gtagId,
    id: gtagId,
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
