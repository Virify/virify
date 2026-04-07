import { createSharedComposable } from "@vueuse/core";

export const useAdminExport = createSharedComposable(() => {
  const isExporting = ref(false);

  async function exportAll() {
    isExporting.value = true;

    try {
      const fetch = useRequestFetch();

      const [overview, users, listings, search, engagement, mortgage] =
        await Promise.all([
          fetch<Record<string, unknown>>("/api/admin/overview"),
          fetch<Record<string, unknown>>("/api/admin/users"),
          fetch<Record<string, unknown>>("/api/admin/listings"),
          fetch<Record<string, unknown>>("/api/admin/search"),
          fetch<Record<string, unknown>>("/api/admin/engagement"),
          fetch<Record<string, unknown>>("/api/admin/mortgage"),
        ]);

      const sections: string[] = [];

      // ─── Overview ──────────────────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Overview") +
          objectsToCsv(flattenOverview(overview))
      );

      // ─── Users ─────────────────────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Users") +
          objectsToCsv(flattenUsers(users))
      );

      // ─── Listings ──────────────────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Listings") +
          objectsToCsv(flattenListings(listings))
      );

      // ─── Search Intelligence ───────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Search Intelligence") +
          flattenSearch(search)
      );

      // ─── Engagement ────────────────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Engagement") +
          flattenEngagement(engagement)
      );

      // ─── Mortgage ──────────────────────────────────────────────────────────
      sections.push(
        formatSectionHeader("Mortgage") +
          flattenMortgage(mortgage)
      );

      const combined = sections.join("\n");
      downloadCsv(combined, `virify-admin-export-${todayDateString()}.csv`);
    } finally {
      isExporting.value = false;
    }
  }

  return { isExporting, exportAll };
});

// ─── Section flatteners ────────────────────────────────────────────────────────

function flattenOverview(data: Record<string, unknown>): Record<string, unknown>[] {
  return Object.entries(data)
    .filter(([, v]) => typeof v !== "object")
    .map(([metric, value]) => ({ Metric: metric, Value: value }));
}

function flattenUsers(data: Record<string, unknown>): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];

  // Top-level scalar stats
  const scalars = Object.entries(data).filter(([, v]) => typeof v !== "object");
  if (scalars.length) {
    rows.push(...scalars.map(([k, v]) => ({ Metric: k, Value: v })));
    rows.push({ Metric: "", Value: "" }); // blank row separator
  }

  if (Array.isArray((data as any).growth)) {
    rows.push({ Metric: "--- Monthly Growth ---", Value: "" });
    rows.push(...(data as any).growth.map((r: any) => ({ Month: r.month, "New Users": r.count })));
    rows.push({ Metric: "", Value: "" });
  }

  if (Array.isArray((data as any).intentBreakdown)) {
    rows.push({ Metric: "--- Intent Breakdown ---", Value: "" });
    rows.push(...(data as any).intentBreakdown.map((r: any) => ({ Intent: r.intent, Count: r.count })));
    rows.push({ Metric: "", Value: "" });
  }

  if (Array.isArray((data as any).membershipDistribution)) {
    rows.push({ Metric: "--- Membership Distribution ---", Value: "" });
    rows.push(...(data as any).membershipDistribution.map((r: any) => ({ Type: r.type, Status: r.status, Count: r.count })));
    rows.push({ Metric: "", Value: "" });
  }

  if (Array.isArray((data as any).activationFunnel)) {
    rows.push({ Metric: "--- Activation Funnel ---", Value: "" });
    rows.push(...(data as any).activationFunnel.map((r: any) => ({ Status: r.status, Count: r.count })));
  }

  return rows;
}

function flattenListings(data: Record<string, unknown>): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];

  const scalars = Object.entries(data).filter(([, v]) => typeof v !== "object");
  rows.push(...scalars.map(([k, v]) => ({ Metric: k, Value: v })));

  if (Array.isArray((data as any).tierBreakdown)) {
    rows.push({ Metric: "", Value: "" });
    rows.push({ Metric: "--- Tier Breakdown ---", Value: "" });
    rows.push(...(data as any).tierBreakdown.map((r: any) => ({ Tier: r.tier, Count: r.count })));
  }

  if (Array.isArray((data as any).priceDistribution)) {
    rows.push({ Metric: "", Value: "" });
    rows.push({ Metric: "--- Price Distribution ---", Value: "" });
    rows.push(...(data as any).priceDistribution.map((r: any) => ({ Bracket: r.bracket, Count: r.count })));
  }

  if (Array.isArray((data as any).saleBreakdown?.tenureTypes)) {
    rows.push({ Metric: "", Value: "" });
    rows.push({ Metric: "--- Sale Tenure Types ---", Value: "" });
    rows.push(...(data as any).saleBreakdown.tenureTypes.map((r: any) => ({ TenureType: r.tenureType, Count: r.count })));
  }

  if (Array.isArray((data as any).rentalBreakdown?.furnishedStatus)) {
    rows.push({ Metric: "", Value: "" });
    rows.push({ Metric: "--- Rental Furnished Status ---", Value: "" });
    rows.push(...(data as any).rentalBreakdown.furnishedStatus.map((r: any) => ({ Status: r.furnishedStatus, Count: r.count })));
  }

  if (Array.isArray((data as any).topFavourited)) {
    rows.push({ Metric: "", Value: "" });
    rows.push({ Metric: "--- Top Favourited Listings ---", Value: "" });
    rows.push(...(data as any).topFavourited.map((r: any, i: number) => ({ Rank: i + 1, ListingId: r.listingId, Favourites: r.count })));
  }

  return rows;
}

function flattenSearch(data: Record<string, unknown>): string {
  const parts: string[] = [];

  const scalars = Object.entries(data).filter(([, v]) => typeof v !== "object");
  parts.push(objectsToCsv(scalars.map(([k, v]) => ({ Metric: k, Value: v }))));

  if (Array.isArray((data as any).topQueries)) {
    parts.push("\n--- Top Queries ---");
    parts.push(objectsToCsv((data as any).topQueries.map((r: any, i: number) => ({ Rank: i + 1, Query: r.query, Count: r.count, ListingType: r.listingType }))));
  }

  if (Array.isArray((data as any).topLocations)) {
    parts.push("\n--- Top Locations ---");
    parts.push(objectsToCsv((data as any).topLocations.map((r: any, i: number) => ({ Rank: i + 1, Location: r.locationPlaceName, Count: r.count, UniqueUsers: r.uniqueUsers, Lat: r.lat, Lon: r.lon }))));
  }

  if (Array.isArray((data as any).zeroResultSearches)) {
    parts.push("\n--- Unmet Demand Signals (Zero Results) ---");
    parts.push(objectsToCsv((data as any).zeroResultSearches.map((r: any, i: number) => ({ Rank: i + 1, Location: r.locationPlaceName, ListingType: r.listingType, TimesSearched: r.count }))));
  }

  if (Array.isArray((data as any).lowResultSearches)) {
    parts.push("\n--- Undersupplied Markets (< 5 Results) ---");
    parts.push(objectsToCsv((data as any).lowResultSearches.map((r: any, i: number) => ({ Rank: i + 1, Location: r.locationPlaceName, ListingType: r.listingType, TimesSearched: r.count, AvgResults: r.avgResultCount }))));
  }

  return parts.join("\n");
}

function flattenEngagement(data: Record<string, unknown>): string {
  const parts: string[] = [];

  const scalars = Object.entries(data).filter(([, v]) => typeof v !== "object");
  parts.push(objectsToCsv(scalars.map(([k, v]) => ({ Metric: k, Value: v }))));

  if (Array.isArray((data as any).trafficSources)) {
    parts.push("\n--- Traffic Sources ---");
    parts.push(objectsToCsv((data as any).trafficSources.map((r: any) => ({ Source: r.source, Count: r.count }))));
  }

  if (Array.isArray((data as any).sharePlatforms)) {
    parts.push("\n--- Share Platforms ---");
    parts.push(objectsToCsv((data as any).sharePlatforms.map((r: any) => ({ Platform: r.platform, Count: r.count }))));
  }

  if (Array.isArray((data as any).topViewedListings)) {
    parts.push("\n--- Top 10 Most Viewed Listings ---");
    parts.push(objectsToCsv((data as any).topViewedListings.map((r: any, i: number) => ({ Rank: i + 1, ListingId: r.listingId, Views: r.views }))));
  }

  if (Array.isArray((data as any).topSharedListings)) {
    parts.push("\n--- Top 10 Most Shared Listings ---");
    parts.push(objectsToCsv((data as any).topSharedListings.map((r: any, i: number) => ({ Rank: i + 1, ListingId: r.listingId, Shares: r.count }))));
  }

  if (Array.isArray((data as any).topCtrListings)) {
    parts.push("\n--- Top 10 Highest CTR Listings ---");
    parts.push(objectsToCsv((data as any).topCtrListings.map((r: any, i: number) => ({ Rank: i + 1, ListingId: r.listingId, Clicks: r.clicks, Impressions: r.impressions, CTR: r.ctr }))));
  }

  if (Array.isArray((data as any).peakDays)) {
    parts.push("\n--- Peak Activity by Day ---");
    parts.push(objectsToCsv((data as any).peakDays.map((r: any) => ({ Day: r.day, Searches: r.searches }))));
  }

  if (Array.isArray((data as any).topReferrers)) {
    parts.push("\n--- Top Referrer Domains ---");
    parts.push(objectsToCsv((data as any).topReferrers.map((r: any, i: number) => ({ Rank: i + 1, Domain: r.domain, Count: r.count }))));
  }

  return parts.join("\n");
}

function flattenMortgage(data: Record<string, unknown>): string {
  const parts: string[] = [];

  const scalars = Object.entries(data).filter(([, v]) => typeof v !== "object");
  parts.push(objectsToCsv(scalars.map(([k, v]) => ({ Metric: k, Value: v }))));

  if ((data as any).averages) {
    parts.push("\n--- Averages ---");
    parts.push(objectsToCsv(
      Object.entries((data as any).averages).map(([k, v]) => ({ Metric: k, Value: v }))
    ));
  }

  if (Array.isArray((data as any).buyerTypeBreakdown)) {
    parts.push("\n--- Buyer Type Breakdown ---");
    parts.push(objectsToCsv((data as any).buyerTypeBreakdown.map((r: any) => ({ BuyerType: r.buyerType, Count: r.count }))));
  }

  if (Array.isArray((data as any).ltvBracketBreakdown)) {
    parts.push("\n--- LTV Bracket Breakdown ---");
    parts.push(objectsToCsv((data as any).ltvBracketBreakdown.map((r: any) => ({ LTVBracket: r.ltvBracket, Count: r.count }))));
  }

  if (Array.isArray((data as any).monthlyTrend)) {
    parts.push("\n--- Monthly Trend (Last 12 Months) ---");
    parts.push(objectsToCsv((data as any).monthlyTrend.map((r: any) => ({ Month: r.month, Count: r.count }))));
  }

  if (Array.isArray((data as any).priceDistribution)) {
    parts.push("\n--- Property Price Distribution ---");
    parts.push(objectsToCsv((data as any).priceDistribution.map((r: any) => ({ Bracket: r.bracket, Count: r.count }))));
  }

  return parts.join("\n");
}
