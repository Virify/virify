/**
 * GET /api/admin/users
 * Comprehensive user intelligence. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalUsers,
    activationStatuses,
    reviewStatuses,
    verifications,
    membershipGroups,
    retentionToday,
    retentionWeek,
    retentionMonth,
    retentionQuarter,
    neverLoggedIn,
    upgrades,
    profileStats,
    rawUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),

    // Activation funnel
    prisma.verification.groupBy({
      by: ["activated"],
      _count: { activated: true },
    }),

    // Review status
    prisma.verification.groupBy({
      by: ["reviewed"],
      _count: { reviewed: true },
    }),

    // Verification completeness counts
    prisma.verification.findMany({
      where: { userId: { not: null } },
      select: { identity: true, address: true, bank: true, payslip: true },
    }),

    // Membership distribution
    prisma.membership.groupBy({
      by: ["type", "status"],
      _count: { id: true },
    }),

    // Retention: active in each window
    prisma.user.count({ where: { lastLogin: { gte: startOfToday }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: sevenDaysAgo }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: thirtyDaysAgo }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: ninetyDaysAgo }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: null, deletedAt: null } }),

    // Upgrades
    prisma.membership.count({ where: { previousType: { not: null } } }),

    // Profile completeness
    prisma.user.aggregate({
      where: { deletedAt: null },
      _count: {
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        phoneNumber: true,
        addressId: true,
      },
    }),

    // Users for intent breakdown (only fetch intents field)
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { intents: true },
    }),
  ]);

  // Monthly growth: users created in each of last 12 months
  const growthRaw = await prisma.user.findMany({
    where: { createdAt: { gte: twelveMonthsAgo }, deletedAt: null },
    select: { createdAt: true },
  });

  const growthMap: Record<string, number> = {};
  for (const u of growthRaw) {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, "0")}`;
    growthMap[key] = (growthMap[key] ?? 0) + 1;
  }
  const growth = Object.entries(growthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // Intent breakdown
  const intentMap: Record<string, number> = {};
  for (const u of rawUsers) {
    for (const intent of u.intents) {
      intentMap[intent] = (intentMap[intent] ?? 0) + 1;
    }
  }
  const intentBreakdown = Object.entries(intentMap).map(([intent, count]) => ({ intent, count }));

  // Verification completeness percentages
  const total = verifications.length || 1;
  const verificationCompleteness = {
    identity: { count: verifications.filter((v) => v.identity === true).length, pct: 0 },
    address: { count: verifications.filter((v) => v.address === true).length, pct: 0 },
    bank: { count: verifications.filter((v) => v.bank === true).length, pct: 0 },
    payslip: { count: verifications.filter((v) => v.payslip === true).length, pct: 0 },
  };
  for (const k of Object.keys(verificationCompleteness) as (keyof typeof verificationCompleteness)[]) {
    verificationCompleteness[k].pct = Math.round((verificationCompleteness[k].count / total) * 100);
  }

  // Profile completeness
  const profileCompleteness = {
    firstName: { count: profileStats._count.firstName, pct: Math.round((profileStats._count.firstName / totalUsers) * 100) },
    lastName: { count: profileStats._count.lastName, pct: Math.round((profileStats._count.lastName / totalUsers) * 100) },
    avatar: { count: profileStats._count.avatar, pct: Math.round((profileStats._count.avatar / totalUsers) * 100) },
    bio: { count: profileStats._count.bio, pct: Math.round((profileStats._count.bio / totalUsers) * 100) },
    phoneNumber: { count: profileStats._count.phoneNumber, pct: Math.round((profileStats._count.phoneNumber / totalUsers) * 100) },
    address: { count: profileStats._count.addressId, pct: Math.round((profileStats._count.addressId / totalUsers) * 100) },
  };

  return {
    totalUsers,
    growth,
    activationFunnel: activationStatuses.map((r) => ({ status: r.activated, count: r._count.activated })),
    reviewStatus: reviewStatuses.map((r) => ({ status: r.reviewed, count: r._count.reviewed })),
    verificationCompleteness,
    intentBreakdown,
    membershipDistribution: membershipGroups.map((r) => ({ type: r.type, status: r.status, count: r._count.id })),
    retention: {
      today: retentionToday,
      sevenDays: retentionWeek,
      thirtyDays: retentionMonth,
      ninetyDays: retentionQuarter,
      neverLoggedIn,
    },
    upgrades,
    profileCompleteness,
  };
});
