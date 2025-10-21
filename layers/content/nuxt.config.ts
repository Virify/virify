/**
 * Sanity Configuration for Production and Preview Environments
 * 
 * This configuration supports two modes:
 * 
 * PRODUCTION MODE (virify.co.uk):
 * - Set SANITY_PREVIEW env var to false or leave unset
 * - Uses CDN for fast content delivery
 * - Fetches only published content (perspective: 'published')
 * - No API token exposed in browser (security)
 * - Visual editing loaded but disabled (stega: false) to prevent CORS issues
 * 
 * PREVIEW MODE (preview.virify.co.uk):
 * - Set SANITY_PREVIEW=true in environment
 * - CDN disabled to allow draft content fetching
 * - Fetches draft content (perspective: 'drafts')
 * - API token available in browser (needed for drafts)
 * - Visual editing enabled (stega: true) for Studio Presentation Tool overlays
 * 
 * IMPORTANT: visualEditing config must always be present (even in production)
 * because @nuxtjs/sanity v2.0.0+ loads React dependencies at build time.
 * We control behavior via the `stega` flag to avoid CORS 403 errors from
 * Sanity CDN when it sees source map parameters in API requests.
 */
const isPreview = process.env.SANITY_PREVIEW === 'true'

export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    
    // CDN: enabled in production for speed, disabled in preview for draft access
    useCdn: !isPreview,
    
    // Perspective: 'published' content in production, 'drafts' in preview
    perspective: isPreview ? 'drafts' : 'published',
    
    // Token: only include in preview mode to avoid browser security warnings
    ...(isPreview && { token: process.env.SANITY_API_TOKEN }),
    
    // Visual editing must always be configured (module limitation)
    // but stega flag controls whether source maps are added to API requests
    visualEditing: {
      studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN,
      
      // Stega: false in production (no source maps = no CORS issues)
      //        true in preview (source maps enable Studio overlays)
      stega: isPreview,
      
      mode: 'visual-editing',
      previewMode: {
        enable: '/api/preview/enable',
        disable: '/api/preview/disable',
      },
    },
  },

  
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      baseURL: `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`,
    },
  }
});
