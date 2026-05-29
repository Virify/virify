// Public endpoint — no authentication required
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username');

  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Username is required' });
  }

  const profile = await findPublicProfileByUsername(username);

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' });
  }

  return { profile };
});
