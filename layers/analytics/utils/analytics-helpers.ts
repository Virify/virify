// Analytics helper utilities

export const ANALYTICS_COLORS = {
  BRAND_ORANGE: '#FF6B35',
  BRAND_ORANGE_LIGHT: '#FF8F66',
  BRAND_PURPLE: '#6B5B95',
} as const;

export const DEVICE_COLORS = [
  ANALYTICS_COLORS.BRAND_ORANGE,
  ANALYTICS_COLORS.BRAND_PURPLE,
  ANALYTICS_COLORS.BRAND_ORANGE_LIGHT,
];

export const PERIOD_OPTIONS = [
  { value: '7d' as const, label: '7 Days' },
  { value: '30d' as const, label: '30 Days' },
  { value: '90d' as const, label: '90 Days' },
];

export type AnalyticsPeriod = '7d' | '30d' | '90d';

/**
 * Format seconds into a human-readable duration string
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

/**
 * Get icon name for a traffic source
 */
export const getSourceIcon = (source: string): string => {
  const icons: Record<string, string> = {
    search: 'i-lucide-search',
    direct: 'i-lucide-globe',
    social: 'i-lucide-share-2',
    email: 'i-lucide-mail',
    referral: 'i-lucide-link',
  };
  return icons[source] || 'i-lucide-circle';
};

/**
 * Get heat color for activity visualization based on intensity (0-1)
 */
export const getHeatColor = (intensity: number): string => {
  const alpha = 0.2 + intensity * 0.8;
  return `rgba(255, 107, 53, ${alpha})`; // Brand orange with varying opacity
};

/**
 * Format date for chart labels
 */
export const formatChartDate = (date: string, isMobile: boolean): string => {
  const d = new Date(date);
  return isMobile
    ? d.toLocaleDateString('en-GB', { day: 'numeric' })
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/**
 * Get period label from period value
 */
export const getPeriodLabel = (period: AnalyticsPeriod): string => {
  const option = PERIOD_OPTIONS.find(p => p.value === period);
  return option?.label || '30 Days';
};

/**
 * Calculate conversion funnel from analytics summary
 */
export const calculateConversionFunnel = (summary: {
  totalImpressions: number;
  totalViews: number;
  totalFavourites: number;
  totalEnquiries: number;
} | null) => {
  if (!summary) {
    return [
      { label: 'Impressions', value: 0, percentage: 0 },
      { label: 'Views', value: 0, percentage: 0 },
      { label: 'Favourited', value: 0, percentage: 0 },
      { label: 'Enquiries', value: 0, percentage: 0 },
    ];
  }

  const { totalImpressions, totalViews, totalFavourites, totalEnquiries } = summary;

  return [
    { label: 'Impressions', value: totalImpressions, percentage: 100 },
    { label: 'Views', value: totalViews, percentage: totalImpressions > 0 ? Math.round((totalViews / totalImpressions) * 100) : 0 },
    { label: 'Favourited', value: totalFavourites, percentage: totalImpressions > 0 ? Math.round((totalFavourites / totalImpressions) * 100) : 0 },
    { label: 'Enquiries', value: totalEnquiries, percentage: totalImpressions > 0 ? Math.round((totalEnquiries / totalImpressions) * 100) : 0 },
  ];
};

/**
 * Default peak hours data (simulated - would come from backend)
 */
export const getDefaultPeakHours = () => {
  const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
  return hours.map((label, i) => ({
    hour: i,
    label,
    intensity: [0.3, 0.7, 0.5, 0.4, 0.9, 0.6][i] || 0.5,
  }));
};

/**
 * Empty analytics summary for zero-state display
 */
export const getEmptyAnalyticsSummary = () => ({
  totalViews: 0,
  totalImpressions: 0,
  totalFavourites: 0,
  totalEnquiries: 0,
  totalListings: 0,
  ctr: 0,
  viewsChange: 0,
  impressionsChange: 0,
});

/**
 * UPageCard UI config for analytics cards
 */
export const ANALYTICS_CARD_UI = {
  leadingIcon: 'text-secondary',
  title: 'body-sm font-bold',
  description: 'body-xs text-muted-foreground',
  container: 'border border-secondary rounded-lg',
};
