export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);
  try {
    if (!user) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    return await getRecentUserNotes(user.id as number);
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});
