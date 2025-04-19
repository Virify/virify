import * as z from "zod";

const activateSchema = z.object({
  token: z.string(),
});

/**
 * Handles user activation by verifying the token and updating their password.
 */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { token } = await readValidatedBody(event, activateSchema.parse);
    const user = await findOwnerByActivationToken(token);

    if (!user) throw createError({ statusCode: 404, statusMessage: "Invalid Token." });

    await updateOwnerAndActivate(user.id);
    return {
      user,
    };
  } catch (error) {
    return errorResponse(error, event);
  }
});
