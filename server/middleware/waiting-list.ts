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
      '/auth/login',                 // Login endpoint
      '/auth/verify-otp',            // OTP verification
      '/api/support',              // POST - support request form
      '/api/analytics', // Track listing views & dashboard analytics
      '/api/listing',              // Listing data endpoints
      '/api/draft-listings',       // Create/Edit listing endpoints
      '/api/listing/preview',      // Listing preview endpoints
      '/api/address',              // Address lookup
      '/api/property-type',        // Property types
      '/api/cloudflare',           // Image upload
      '/api/user',                 // User dashboard data
      '/api/conversation',         // Dashboard conversations
      '/api/notifications',        // Dashboard notifications
    ];

    // Check if the path is an API route or Auth route
    if (path.startsWith('/api/') || path.startsWith('/auth/')) {
      // Check if it's an allowed API
      const isAllowed = allowedApis.some(allowed => path.startsWith(allowed));
      
      if (!isAllowed) {
        console.warn(`[MIDDLEWARE] Blocking API access to ${path} in waiting-list mode`);
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied in waiting list mode'
        });
      }
    }
  }
});
