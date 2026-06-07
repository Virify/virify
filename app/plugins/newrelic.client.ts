// plugins/newrelic.client.ts
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        src: '/newrelic-agent.js',
        type: 'text/javascript',
        // Instructs Nuxt to load the browser telemetry script right away
        tagPosition: 'head'
      }
    ]
  })
})