/**
 * Nitro Error Logger Plugin
 *
 * Hooks into all unhandled server errors (SSR, API, and middleware) and logs
 * them to stdout so they appear in Railway / production server logs.
 *
 * The client-side error.vue console.error only runs in the browser, so without
 * this plugin intermittent 500s during SSR leave no trace in server logs.
 *
 * Two hooks:
 * - `error`         — catches unhandled throws (SSR, thrown createError, etc.)
 * - `afterResponse` — catches handled 5xx where the endpoint caught the error
 *                     itself and returned it as a response body (no re-throw)
 */
export default defineNitroPlugin((nitroApp) => {
  // Unhandled / thrown errors
  nitroApp.hooks.hook('error', (error: any, { event }: any) => {
    // Skip 4xx client errors — not actionable noise
    const status = error?.statusCode ?? error?.status ?? 500;
    if (status >= 400 && status < 500) return;

    // Single-line JSON so Railway's Log Explorer can parse fields
    process.stderr.write(JSON.stringify({
      level: 'error',
      source: 'server:unhandled',
      status,
      url: event?.path ?? 'unknown',
      method: event?.method ?? 'unknown',
      requestId: (event?.node?.req?.headers?.['x-request-id'] as string) ?? undefined,
      message: error?.message ?? String(error),
      stack: error?.stack,
      data: error?.data,
    }) + '\n');
  });

  // Handled errors — endpoints that catch internally and return a 5xx response
  // without re-throwing (e.g. via useResponse().errorResponse())
  nitroApp.hooks.hook('afterResponse', (event: any, response: any) => {
    const status: number = event?.node?.res?.statusCode ?? 200;
    if (status < 500) return;

    process.stderr.write(JSON.stringify({
      level: 'error',
      source: 'server:handled',
      status,
      url: event?.path ?? 'unknown',
      method: event?.method ?? 'unknown',
      requestId: (event?.node?.req?.headers?.['x-request-id'] as string) ?? undefined,
      // Only include body if it looks like an error object — avoid logging large payloads
      body: response?.body && typeof response.body === 'object' && ('error' in response.body || 'message' in response.body)
        ? response.body
        : undefined,
    }) + '\n');
  });
});
