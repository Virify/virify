export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true, // Enable CDN for performance; disable only for preview/draft queries as needed
    // Token present to allow Studio/visual editing during dev
    // Use environment variable here because `runtimeConfig` is not available at module evaluation time
    visualEditing: {
      studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN,
      stega: true,
      mode: 'visual-editing', // Basic visual editing for preview
      previewMode: {
        enable: '/api/preview/enable',
        disable: '/api/preview/disable',
      },
    }
  },

  
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      baseURL: `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`,
    },
  }
});
