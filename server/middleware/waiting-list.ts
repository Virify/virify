/**
 * Server middleware to block API access in waiting list mode
 * Only allows specific waiting list APIs
 */
import { defineEventHandler, createError } from "h3";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  
  // Only apply restrictions if in waiting-list mode
  if (config.public.DEPLOYMENT_ENV === 'waiting-list') {
    const path = event.path;

    // Allow these API endpoints in waiting list mode
    const allowedApis = [
      '/api/waiting-list',           // POST - join waiting list
      '/api/waiting-list/count',     // GET - get count
      '/api/contact',                // POST - contact form
      '/api/sanity/',                // Sanity CMS content (guides, etc.)
      '/api/_auth/',                 // Nuxt Auth Utils endpoints
      '/api/price-paid/',            // Price Paid Data endpoints
      '/api/__sitemap__/',           // Nuxt SEO sitemap generation
      '/api/preview/enable',         // Sanity preview enable
      '/api/preview/disable',        // Sanity preview disable
      // '/api/mortgage/',              // Mortgage calculator endpoints (calculate, rates, admin)
      // '/api/analytics/mortgage/track', // Track mortgage calculator usage
      '/auth/update-admin-password', // Admin password update (protected by TASK_SECRET)
      '/api/support',              // POST - support request form
    ];

    // Check if the path is an API route
    if (path.startsWith('/api/')) {
      // Check if it's an allowed API
      const isAllowed = allowedApis.some(allowed => path.startsWith(allowed));
      
      if (!isAllowed) {
        console.warn(`[MIDDLEWARE] Blocking API access to ${path} in waiting-list mode`);
      }
    }
  }
});
