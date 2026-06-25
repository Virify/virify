export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const route = useRoute();
  const { trackPageView: trackInternalPageView } = useAnalyticsTracking();
  const lastTrackedFullPath = ref<string | null>(null);

  function trackCurrentPage() {
    const currentRoute = router.currentRoute.value;

    if (!currentRoute.fullPath || currentRoute.fullPath === lastTrackedFullPath.value) {
      return;
    }

    lastTrackedFullPath.value = currentRoute.fullPath;

    trackInternalPageView({
      path: currentRoute.path,
      fullPath: currentRoute.fullPath,
      title: document.title,
      routeName:
        typeof currentRoute.name === "string" ? currentRoute.name : undefined,
    });
  }

  nuxtApp.hook("app:mounted", () => {
    trackCurrentPage();
  });

  router.afterEach(() => {
    nextTick(trackCurrentPage);
  });

  watch(
    () => route.fullPath,
    () => nextTick(trackCurrentPage),
  );
});
