import { z } from "zod";

const querySchema = z.object({
  q: z.string().min(1),
});

/**
 * GET /api/admin/users/search?q=...
 * Search users by email or username for autocomplete. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const { q } = await getValidatedQuery(event, querySchema.parse);

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      verification: { select: { role: true } },
    },
    take: 10,
    orderBy: { email: "asc" },
  });

  return users.map((u) => ({
    label: u.username ? `${u.username} (${u.email})` : u.email,
    value: u.email,
    role: u.verification?.role ?? "USER",
  }));
});
