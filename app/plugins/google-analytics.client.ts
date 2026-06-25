export default defineNuxtPlugin(() => {
  const googleAnalyticsId = useRuntimeConfig().public.scripts?.googleAnalytics?.id;

  if (!googleAnalyticsId) return;

  // 1. Instantiate the script and capture the instance in one go
  const instance = useScriptGoogleAnalytics();

  const route = useRoute();

  useScriptEventPage(({ title }) => {
    instance.proxy.gtag("event", "page_view", {
      page_title: title,
      page_path: route.fullPath,
      page_location: window.location.href,
    });
  });
});
