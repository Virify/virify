/**
 * Assigns a unique request ID to every incoming request.
 *
 * - Reuses `x-request-id` from the client if already present (e.g. from a
 *   load balancer or upstream proxy like Railway's router)
 * - Otherwise generates a fresh UUID
 *
 * The ID is forwarded on the response so the browser can correlate client-side
 * and server-side log entries in Railway's Log Explorer.
 */
export default defineEventHandler((event) => {
  const existing = getRequestHeader(event, 'x-request-id');
  const requestId = existing ?? crypto.randomUUID();

  // Make the ID available to downstream handlers via the request header
  event.node.req.headers['x-request-id'] = requestId;

  // Echo it on the response so the browser can log it alongside client errors
  setResponseHeader(event, 'x-request-id', requestId);
});
