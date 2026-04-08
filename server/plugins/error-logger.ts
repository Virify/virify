/**
 * Nitro Error Logger Plugin
 *
 * Hooks into all unhandled server errors (SSR, API, and middleware) and logs
 * them to stdout so they appear in Railway / production server logs.
 *
 * The client-side error.vue console.error only runs in the browser, so without
 * this plugin intermittent 500s during SSR leave no trace in server logs.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error: any, { event }: any) => {
    // Skip 4xx client errors — not actionable noise
    const status = error?.statusCode ?? error?.status ?? 500;
    if (status >= 400 && status < 500) return;

    // Single-line JSON so Railway's Log Explorer can parse fields
    process.stderr.write(JSON.stringify({
      level: 'error',
      source: 'server',
      status,
      url: event?.path ?? 'unknown',
      method: event?.method ?? 'unknown',
      message: error?.message ?? String(error),
      stack: error?.stack,
      data: error?.data,
    }) + '\n');
  });
});
