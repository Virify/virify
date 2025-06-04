export type NavigationItem = {
  name: string;
  url: string;
  icon: string;
  action?: string;
  countKey?: string;
}

export type NavigationGroup = {
  title?: string;
  icon: string;
  items?: NavigationItem[];
}

// AccountCounts has been moved to AnalyticsAggregates in ~/shared/types/analytics.ts
