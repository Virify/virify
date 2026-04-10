import * as z from "zod";

const querySchema = z.object({
  username: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.id) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const { username } = await getValidatedQuery(event, querySchema.parse);

  const existing = await prisma.user.findFirst({
    where: {
      username: { equals: username, mode: 'insensitive' },
      id: { not: user.id },
    },
    select: { id: true },
  });

  return { available: !existing };
});
