/**
 * Endpoint to handle agent verification.
 * @param event - The H3 event object.
 * @returns A standardized HTTP response indicating the result of the verification process.
 */
export default defineEventHandler(async (event) => {
  const { successResponse } = useResponse();
  const { token } = getRouterParams(event);
  const { email } = getQuery(event);

  try {
    // Retrieve the owner along with their verification details
    const owner = await findOwnerWithVerification(email as string);

    // If the owner does not exist or has no verification details, return a 404 error
    if (!owner) throw createError({ statusCode: 404, statusMessage: "Owner not found!" });

    // Validate the review token
    if (owner.verification?.reviewToken !== token) throw createError({ statusCode: 401, statusMessage: "Token invalid!" });

    // Update the owner and review
    if (!owner.verification?.activated) await updateOwnerAndReview(owner.id);

    return successResponse("Owner reviewed successfully");
  } catch (error) {
    return error;
  }
});
