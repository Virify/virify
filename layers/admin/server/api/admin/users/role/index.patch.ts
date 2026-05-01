import { z } from "zod";
import { Role } from "~~/layers/database/server/database/prisma/generated/enums";

const bodySchema = z.object({
  query: z.string().min(1, "Email or username is required"),
  role: z
    .enum(Object.values(Role) as [string, ...string[]])
    .transform((r) => r as Role),
});

/**
 * PATCH /api/admin/users/role
 * Update a user's verification role by email or username. Admin only.
 * The target user's session is cleared so their next request picks up the new role.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const { query, role } = await readValidatedBody(event, bodySchema.parse);

  const target = await prisma.user.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { email: { equals: query.toLowerCase(), mode: "insensitive" } },
        { username: { equals: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      verification: { select: { id: true } },
    },
  });

  if (!target) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  if (!target.verification) {
    throw createError({
      statusCode: 422,
      statusMessage: "User has no verification record",
    });
  }

  await prisma.verification.update({
    where: { userId: target.id },
    data: { role },
  });

  console.log(
    `[Admin] ${user.email} updated role for user ${target.email} → ${role}`,
  );

  return { success: true, userId: target.id, email: target.email, role };
});
