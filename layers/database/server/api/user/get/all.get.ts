import { getAllUsers } from "../../../utils/user";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const users = await getAllUsers();

  return users;
});
