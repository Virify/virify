export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: process.env.SANITY_PREVIEW === 'true' ? false : true,
    perspective: process.env.SANITY_PREVIEW === 'true' ? 'drafts' : 'published',
    visualEditing: {
      studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
      token: process.env.SANITY_API_TOKEN,
      stega: process.env.SANITY_PREVIEW === 'true', // Only enable stega on preview
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
