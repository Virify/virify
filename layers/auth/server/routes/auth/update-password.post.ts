import { z } from "zod";
import { updatePasswordByToken, updatePasswordBySession } from "../../utils/update-user-password";

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  passwordToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  try {
    const { password, passwordToken } = await readValidatedBody(event, passwordSchema.parse);

    if (passwordToken) {
      await updatePasswordByToken(passwordToken, password);
    } else {
      await updatePasswordBySession(event, password);
    }
  } catch (error) {
    return errorResponse(error, event);
  }
});
