// Tier features utility for listing creation

export interface TierFeatures {
  tier: "PREMIUM" | "FEATURED" | "BASIC";
  features: string[];
}

// Features for each tier
export const tierFeatures: TierFeatures[] = [
  {
    tier: "basic",
    features: [
      "Direct communication (in‑app chat & verified identity)",
      "Up to 10 active listings",
      "Up to 10 images per listing (standard hosting)",
      "Standard map pin",
      "Standard analytics (views & enquiries)",
      "Email notifications",
      "AI valuation: 1 per listing",
      "AI‑enhanced photos: brighten & crop",
      "Verification included (property + lister)",
      "Standard search visibility",
      "Comparables: local averages",
      "Secure in‑app offers: enabled",
      "Support: email",
    ],
  },
  {
    tier: "featured",
    features: [
      "Direct communication (in‑app chat & verified identity)",
      "Up to 10 active listings",
      "Up to 25 images per listing (HD + auto‑enhance)",
      "Map + local amenities (schools, shops, transport)",
      "Advanced analytics (heatmaps, CTR, buyer insights)",
      "Email + Push notifications",
      "AI valuation: 3 per listing",
      "AI‑enhanced photos: declutter + stage",
      "Verification included",
      "Visibility: boosted (Featured badge, higher ranking)",
      "Virtual tour hosting: 1 per listing",
      "Comparables: street‑level insights",
      "Secure in‑app offers: priority alerts",
      "Support: priority chat",
      "Extras: Featured badge + Featured Listing Card",
    ],
  },
  {
    tier: "premium",
    features: [
      "Direct communication (in‑app chat & verified identity)",
      "Up to 10 active listings",
      "Up to 50 images per listing (HD + AI staging, overlays)",
      "Interactive maps + lifestyle layers (commute, crime, broadband, green space)",
      "Pro analytics (market trends, demand forecasts)",
      "Email + Push + SMS priority notifications",
      "AI valuation: unlimited",
      "AI‑enhanced photos: full suite (staging + neighbourhood highlights)",
      "Verification fast‑track",
      "Visibility: top prominence (Premium badge, first‑page)",
      "Virtual tour hosting: unlimited",
      "Comparables: predictive pricing & demand",
      "Secure in‑app offers: negotiation dashboard",
      "Support: priority chat + phone",
      "Extras: concierge listing review + Premium Listing Card",
    ],
  },
];

/**
 * Get features for a specific tier
 * @param tier - The tier to get features for
 * @returns Array of features for the tier
 */
export function getTierFeatures(tier: "premium" | "featured" | "basic"): string[] {
  const tierData = tierFeatures.find((t) => t.tier === tier);
  return tierData?.features || [];
}

/**
 * Get all tier features as a map
 * @returns Map of tier names to their features
 */
export function getTierFeaturesMap(): Record<string, string[]> {
  return tierFeatures.reduce(
    (acc, tier) => {
      acc[tier.tier] = tier.features;
      return acc;
    },
    {} as Record<string, string[]>
  );
}

/**
 * Get maximum number of images allowed for a tier
 * @param tier - The tier to get image limit for
 * @returns Maximum number of images allowed
 */
export function getMaxImagesForTier(tier: "PREMIUM" | "FEATURED" | "BASIC" | null | undefined): number {
  if (!tier) return 5; // Default to basic tier limit
  
  const tierLower = tier.toLowerCase() as "premium" | "featured" | "basic";
  
  switch (tierLower) {
    case "premium":
      return 50;
    case "featured":
      return 20;
    case "basic":
    default:
      return 5;
  }
}
