export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    visualEditing: {
      studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN,
      stega: true,
    }
  },
  
  runtimeConfig: {
    sanityProjectId: process.env.SANITY_PROJECT_ID,
  },
  
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      baseURL: `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`,
    },
  }
});
