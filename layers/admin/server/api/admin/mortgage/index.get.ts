/**
 * GET /api/admin/mortgage
 * Mortgage calculator usage and buyer intelligence. Admin only.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!isAdmin(user)) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

  const [
    total,
    thisMonth,
    linkedToListing,
    buyerTypeBreakdown,
    ltvBracketBreakdown,
    averages,
    defaultRatesUsed,
    customRateUsed,
    monthlyTrendRaw,
    // Price distribution brackets
    priceUnder100k,
    price100to250k,
    price250to500k,
    price500to1m,
    priceOver1m,
  ] = await Promise.all([
    prisma.mortgageCalculation.count(),
    prisma.mortgageCalculation.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.mortgageCalculation.count({ where: { listingId: { not: null } } }),

    prisma.mortgageCalculation.groupBy({
      by: ["buyerType"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.mortgageCalculation.groupBy({
      by: ["ltvBracket"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.mortgageCalculation.aggregate({
      _avg: {
        propertyPrice: true,
        deposit: true,
        ltv: true,
        loanAmount: true,
        monthlyPayment: true,
        totalInterest: true,
        termYears: true,
      },
    }),

    prisma.mortgageCalculation.count({ where: { usedDefaultRates: true } }),
    prisma.mortgageCalculation.count({ where: { usedCustomRate: true } }),

    // Monthly trend: fetch all in last 12 months and bucket by month
    prisma.mortgageCalculation.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    }),

    // Property price distribution
    prisma.mortgageCalculation.count({ where: { propertyPrice: { lt: 100000 } } }),
    prisma.mortgageCalculation.count({ where: { propertyPrice: { gte: 100000, lt: 250000 } } }),
    prisma.mortgageCalculation.count({ where: { propertyPrice: { gte: 250000, lt: 500000 } } }),
    prisma.mortgageCalculation.count({ where: { propertyPrice: { gte: 500000, lt: 1000000 } } }),
    prisma.mortgageCalculation.count({ where: { propertyPrice: { gte: 1000000 } } }),
  ]);

  // Bucket monthly trend
  const monthlyMap: Record<string, number> = {};
  for (const calc of monthlyTrendRaw) {
    const key = `${calc.createdAt.getFullYear()}-${String(calc.createdAt.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
  }
  const monthlyTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  const round2 = (n: number | null | undefined) =>
    n != null ? Math.round(n * 100) / 100 : null;

  return {
    totals: {
      allTime: total,
      thisMonth,
      linkedToListing,
      standalone: total - linkedToListing,
    },
    monthlyTrend,
    buyerTypeBreakdown: buyerTypeBreakdown.map((r) => ({
      type: r.buyerType,
      count: r._count.id,
    })),
    ltvBracketBreakdown: ltvBracketBreakdown.map((r) => ({
      bracket: r.ltvBracket,
      count: r._count.id,
    })),
    averages: {
      propertyPrice: round2(averages._avg.propertyPrice),
      deposit: round2(averages._avg.deposit),
      ltv: round2(averages._avg.ltv),
      loanAmount: round2(averages._avg.loanAmount),
      monthlyPayment: round2(averages._avg.monthlyPayment),
      totalInterest: round2(averages._avg.totalInterest),
      termYears: round2(averages._avg.termYears),
    },
    ratePreference: {
      usedDefaultRates: defaultRatesUsed,
      usedCustomRate: customRateUsed,
    },
    propertyPriceDistribution: [
      { bracket: "Under £100k", count: priceUnder100k },
      { bracket: "£100k–£250k", count: price100to250k },
      { bracket: "£250k–£500k", count: price250to500k },
      { bracket: "£500k–£1m", count: price500to1m },
      { bracket: "Over £1m", count: priceOver1m },
    ],
  };
});
