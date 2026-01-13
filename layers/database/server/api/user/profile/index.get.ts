export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const fullUser = await findUserforProfileUpdate(user.id);

  if (!fullUser) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return fullUser;
});