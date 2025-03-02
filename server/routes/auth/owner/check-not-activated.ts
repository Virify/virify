/**
 * Check if the user is activated.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response.
 */
export default defineEventHandler(async (event) => {
  // Extract email from the query parameters
  const { email } = getQuery(event);
  const { successResponse } = useResponse();

  // Find the user by email
  const user = await findOwner(email as string);

  // Throw an error if the user is not found
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

  // Throw an error if the user is already activated
  if (user.isActivated) throw createError({ statusCode: 400, statusMessage: "User already activated" });

  return successResponse("User not activated");
});
