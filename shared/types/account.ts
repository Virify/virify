export type AccountNavigationItem = {
  name: string;
  url: string;
  icon: string;
  action?: string;
  countKey?: string;
}

export type AccountNavigationGroup = {
  title?: string;
  icon: string;
  items?: AccountNavigationItem[];
}

// AccountCounts has been moved to AnalyticsAggregates in ~/shared/types/analytics.ts
