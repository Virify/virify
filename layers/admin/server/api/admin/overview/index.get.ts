/**
 * GET /api/admin/overview
 * Platform-wide KPI summary. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = sevenDaysAgo;

  const [
    totalUsers,
    activeUsersToday,
    activeUsersThisWeek,
    activeUsersThisMonth,
    newUsersThisWeek,
    newUsersThisMonth,
    usersWithListings,
    usersWithFavourites,
    usersWithNotes,
    usersWithHiddenListings,
    totalPublishedListings,
    totalDraftListings,
    totalArchivedListings,
    searchesAgg,
    totalMortgageCalculations,
    totalConversations,
    totalMessages,
    totalListingViews,
    totalListingImpressions,
    totalListingClicks,
    totalListingShares,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: startOfToday }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: startOfWeek }, deletedAt: null } }),
    prisma.user.count({ where: { lastLogin: { gte: thirtyDaysAgo }, deletedAt: null } }),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek }, deletedAt: null } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth }, deletedAt: null } }),
    prisma.user.count({ where: { listings: { some: { published: true } }, deletedAt: null } }),
    prisma.user.count({ where: { preferences: { some: { favourites: { some: {} } } }, deletedAt: null } }),
    prisma.user.count({ where: { preferences: { some: { notes: { some: {} } } }, deletedAt: null } }),
    prisma.user.count({ where: { preferences: { some: { hiddenListings: { some: {} } } }, deletedAt: null } }),
    prisma.listing.count({ where: { published: true, archived: false } }),
    prisma.draftListing.count(),
    prisma.listing.count({ where: { archived: true } }),
    prisma.trackSearch.aggregate({ _sum: { count: true } }),
    prisma.mortgageCalculation.count(),
    prisma.conversation.count(),
    prisma.message.count(),
    prisma.listingView.count(),
    prisma.listingImpression.count(),
    prisma.listingClick.count(),
    prisma.listingShare.count(),
  ]);

  return {
    totalUsers,
    activeUsersToday,
    activeUsersThisWeek,
    activeUsersThisMonth,
    newUsersThisWeek,
    newUsersThisMonth,
    usersWithListings,
    usersWithFavourites,
    usersWithNotes,
    usersWithHiddenListings,
    totalPublishedListings,
    totalDraftListings,
    totalArchivedListings,
    totalSearchesRun: searchesAgg._sum.count ?? 0,
    totalMortgageCalculations,
    totalConversations,
    totalMessages,
    totalListingViews,
    totalListingImpressions,
    totalListingClicks,
    totalListingShares,
  };
});
