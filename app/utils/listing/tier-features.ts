// Tier features utility for listing creation

export interface TierFeatures {
  tier: "premium" | "featured" | "basic";
  features: string[];
}

// Features for each tier
export const tierFeatures: TierFeatures[] = [
  {
    tier: "basic",
    features: [
      "Standard listing visibility",
      "Basic property details",
      "Up to 5 photos",
      "Standard support",
      "30-day listing duration"
    ]
  },
  {
    tier: "featured",
    features: [
      "Enhanced listing visibility",
      "Priority in search results",
      "Up to 15 photos",
      "Premium property details",
      "Social media promotion",
      "Enhanced support",
      "60-day listing duration"
    ]
  },
  {
    tier: "premium",
    features: [
      "Maximum listing visibility",
      "Top placement in search results",
      "Unlimited photos",
      "Virtual tour integration",
      "Professional photography service",
      "Dedicated account manager",
      "Premium branding",
      "Advanced analytics",
      "90-day listing duration"
    ]
  }
];

/**
 * Get features for a specific tier
 * @param tier - The tier to get features for
 * @returns Array of features for the tier
 */
export function getTierFeatures(tier: "premium" | "featured" | "basic"): string[] {
  const tierData = tierFeatures.find(t => t.tier === tier);
  return tierData?.features || [];
}

/**
 * Get all tier features as a map
 * @returns Map of tier names to their features
 */
export function getTierFeaturesMap(): Record<string, string[]> {
  return tierFeatures.reduce((acc, tier) => {
    acc[tier.tier] = tier.features;
    return acc;
  }, {} as Record<string, string[]>);
}
