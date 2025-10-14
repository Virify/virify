/**
 * Server middleware to block API access in waiting list mode
 * Only allows specific waiting list APIs
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  
  // Only apply restrictions if in waiting-list mode
  if (config.public.DEPLOYMENT_ENV === 'waiting-list') {
    const path = event.path;

    // Allow these API endpoints in waiting list mode
    const allowedApis = [
      '/api/waiting-list',           // POST - join waiting list
      '/api/waiting-list/count',     // GET - get count
      '/api/sanity/',                // Sanity CMS content (guides, etc.)
      '/api/_auth/',                 // Nuxt Auth Utils endpoints
    ];

    // Check if the path is an API route
    if (path.startsWith('/api/')) {
      // Check if it's an allowed API
      const isAllowed = allowedApis.some(allowed => path.startsWith(allowed));
      
      if (!isAllowed) {
        throw createError({
          statusCode: 403,
          statusMessage: 'API access is restricted in waiting list mode',
          message: 'You cannot access this API while the app is in waiting list mode.',
        });
      }
    }
  }
});
