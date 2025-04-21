import { z } from "zod";
import type { UserSession } from "#auth-utils";
import { findOwnerById, updateOwnerPasswordById } from "~~/layers/database/server/utils/owner";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
    confirmedPassword: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

export default defineEventHandler(async (event) => {
  const { successResponse, errorResponse } = useResponse();

  try {
    const { password } = await readValidatedBody(event, passwordSchema.parse);
    const session = (await getUserSession(event)) as UserSession;
    const userId = session?.user?.id;

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    const user = await findOwnerById(userId);

    if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

    // Check if the new password is the same as the old password
    const verifiedPassword = await verifyPassword(user.password as string, password);
    
    if(verifiedPassword) throw createError({ statusCode: 400, statusMessage: "New password cannot be the same as the old password" });

    const hashedPassword = await hashPassword(password);
    await updateOwnerPasswordById(userId, hashedPassword);

    return successResponse("Password updated successfully");
  } catch (error) {
    return errorResponse(error, event);
  }
});
