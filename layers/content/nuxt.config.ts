export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    // Token present to allow Studio/visual editing during dev
    // Use environment variable here because `runtimeConfig` is not available at module evaluation time
    visualEditing: {
      studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN,
      stega: true,
    }
  },

  
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      baseURL: `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`,
    },
  }
});
