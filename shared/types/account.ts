export interface NavigationItem {
  name: string;
  url: string;
  icon: string;
  action?: string;
  countKey?: string;
}

export interface AccountCounts {
  notifications?: number;
  messages?: number;
  enquiries?: number;
  listings?: number;
  favourites?: number;
  notes?: number;
  offers?: number;
  viewings?: number;
  // Add more count types as needed
}
