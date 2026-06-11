// plugins/newrelic.client.ts
export default defineNuxtPlugin(() => {
  // Only inject the browser agent in production and after cookie consent
  if (!import.meta.env.PROD) return;

  const { hasConsented } = useCookieConsent();

  const injectAgent = () => {
    useHead({
      script: [
        {
          src: "/newrelic-agent.js",
          type: "text/javascript",
          tagPosition: "head",
        },
      ],
    });
  };

  // If user has already consented on a previous visit, inject immediately
  if (hasConsented.value) {
    injectAgent();
    return;
  }

  // Otherwise watch for consent and inject when granted
  const stop = watch(hasConsented, (consented) => {
    if (consented) {
      injectAgent();
      stop();
    }
  });
});
