// plugins/newrelic.client.ts
export default defineNuxtPlugin(() => {
  // Only inject the browser agent in production
  if (import.meta.env.PROD) {
    useHead({
      script: [
        {
          src: "/newrelic-agent.js",
          type: "text/javascript",
          tagPosition: "head",
        },
      ],
    });
  }
});
