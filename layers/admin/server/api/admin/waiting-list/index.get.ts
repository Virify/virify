/**
 * GET /api/admin/waiting-list/export
 * Export all waiting list emails as a CSV file. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const entries = await waitingListPrisma.waitingList.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const rows = [
    "id,email,signed_up_at",
    ...entries.map((e) =>
      `${e.id},${e.email},${e.createdAt.toISOString()}`
    ),
  ];

  const csv = rows.join("\n");

  setHeader(event, "Content-Type", "text/csv");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename="waiting-list-${new Date().toISOString().slice(0, 10)}.csv"`
  );

  return csv;
});
