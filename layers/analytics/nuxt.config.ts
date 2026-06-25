// Nuxt configuration for the analytics layer
import { defineNuxtConfig } from "nuxt/config";

const googleAnalyticsId = process.env.NUXT_PUBLIC_GTAG_ID || process.env.G_TAG;

export default defineNuxtConfig({
  scripts: {
    registry: {
      googleAnalytics: {
        id: googleAnalyticsId,
        trigger: "onNuxtReady",
        defaultConsent: {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500,
        },
      },
    },
  },
});
