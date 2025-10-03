export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()

  // Must be logged in to view draft previews
  if (!loggedIn.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }
})
