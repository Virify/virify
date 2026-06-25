export default defineNuxtPlugin(() => {
  const googleAnalyticsId = useRuntimeConfig().public.scripts?.googleAnalytics?.id;

  if (!googleAnalyticsId) return;

  useScriptGoogleAnalytics();
});
