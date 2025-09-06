export default defineNuxtConfig({
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
