const isPreview = process.env.SANITY_PREVIEW === 'true'

export default defineNuxtConfig({
  modules: ['@nuxtjs/sanity'],
  sanity: {
    projectId: 'zl7h47m2',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: !isPreview,
    perspective: isPreview ? 'drafts' : 'published',
    ...(isPreview && {
      visualEditing: {
        studioUrl: process.env.SANITY_STUDIO_URL || 'http://localhost:3333',
        token: process.env.SANITY_API_TOKEN,
        stega: true,
        mode: 'visual-editing',
        previewMode: {
          enable: '/api/preview/enable',
          disable: '/api/preview/disable',
        },
      },
    }),
  },

  
  image: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      baseURL: `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`,
    },
  }
});
