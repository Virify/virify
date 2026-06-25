const DEFAULT_GOOGLE_CONSENT = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500,
} as const;

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gtagId = String(config.public.gtagId || "");

  if (!gtagId) {
    console.warn("[analytics] Google Analytics tag ID is not configured");
    return;
  }

  useScriptGoogleAnalytics({
    id: gtagId,
    defaultConsent: DEFAULT_GOOGLE_CONSENT,
    scriptOptions: {
      trigger: "onNuxtReady",
    },
  });
});
