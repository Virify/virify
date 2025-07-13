/**
 * Fetch csent conversations for the authenticated user
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  
  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  return await getSentEnquiryListingIds(user.id);
});