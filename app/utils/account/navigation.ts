export const accountNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    url: "/account",
    icon: "property/house",
  },
  {
    name: "Profile",
    url: "#",
    icon: "profile",
  },
  {
    name: "Notifications",
    url: "#",
    icon: "account/notifications",
    countKey: "notifications",
  },
  {
    name: "Biilling & Plans",
    url: "#",
    icon: "account/billing",
  },
  {
    name: "Analytics",
    url: "#",
    icon: "explore/hot",
  },
  {
    name: "Contact Support",
    url: "#",
    icon: "cards/verified",
  },
  {
    name: "Preferences",
    url: "#",
    icon: "account/account-preferences",
  },
  {
    name: "Settings",
    url: "#",
    icon: "account/settings",
  },
  {
    name: "Logout",
    url: "#",
    icon: "arrow-right",
    action: "logout",
  },
];

export const listingsNavigation: NavigationItem[] = [
  {
    name: "My Listings",
    url: "#",
    icon: "read-more",
    countKey: "listings",
  },
  {
    name: "List New Property",
    url: "#",
    icon: "draw",
  },
  {
    name: "Offers",
    url: "#",
    icon: "account/offers",
    countKey: "offers",
  },
  {
    name: "Favourites",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "favourites",
  },
  {
    name: "Enquiries",
    url: "/user/messages",
    icon: "account/enquiry",
    countKey: "enquiries",
  },

  {
    name: "Viewings",
    url: "#",
    icon: "account/viewing",
    countKey: "viewings",
  },

  {
    name: "Notes",
    url: "#",
    icon: "cards/notes",
    countKey: "notes",
  },
];

export const searchNavigation: NavigationItem[] = [
  {
    name: "Search Properties",
    url: "/",
    icon: "search",
  },
  {
    name: "Map Search",
    url: "/map-search",
    icon: "search",
  },
  {
    name: "Saved Searches",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "savedSearches",
  },
];

export const navigationGroups: NavigationGroup[] = [
  {
    title: "Nofications",
    icon: "account/notifications",
  },
  {
    title: "Listings",
    icon: "property/house",
    items: listingsNavigation,
  },
  {
    title: "Account",
    icon: "profile",
    items: accountNavigation,
  },
  {
    title: "Search",
    icon: "search",
    items: searchNavigation,
  },
];
