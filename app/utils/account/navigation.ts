import type { NavigationMenuItem } from "@nuxt/ui";

export const navigationHome: AccountNavigationItem[] = [
  {
    name: "Home",
    url: "/account",
    icon: "account/dash-home",
  },
  {
    name: "Logout",
    url: "#",
    icon: "account/logout",
    action: "logout",
  },
];

export const accountNavigation: AccountNavigationItem[] = [
  {
    name: "Profile",
    url: "#",
    icon: "profile",
  },
  // {
  //   name: "Billing & Plans",
  //   url: "#",
  //   icon: "account/billing",
  // },
  {
    name: "Analytics",
    url: "/account/analytics",
    icon: "explore/hot",
  },
  // {
  //   name: "Contact Support",
  //   url: "#",
  //   icon: "cards/verified",
  // },
  // {
  //   name: "Preferences",
  //   url: "#",
  //   icon: "account/account-preferences",
  // },

];

export const listingsNavigation: AccountNavigationItem[] = [
  {
    name: "My Listings",
    url: "/account/my-listings",
    icon: "read-more",
    countKey: "listings",
  },
  // {
  //   name: "Offers",
  //   url: "#",
  //   icon: "account/offers",
  //   countKey: "offers",
  // },
  {
    name: "Enquiries",
    url: "/account/messages",
    icon: "account/enquiry",
    countKey: "unreadMessages",
  },
  // {
  //   name: "Viewings",
  //   url: "#",
  //   icon: "account/viewing",
  //   countKey: "viewings",
  // },
  {
    name: "Favourites",
    url: "/account/favourites",
    icon: "cards/favourite-filled",
    countKey: "favourites",
  },
  {
    name: "Notes",
    url: "/account/notes",
    icon: "cards/notes",
    countKey: "notes",
  },
  {
    name: "Create a listing",
    url: "/account/create-listing",
    icon: "draw",
  },
];

export const searchNavigation: AccountNavigationItem[] = [
  {
    name: "Saved Searches",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "savedSearches",
  },
  {
    name: "Saved Locations",
    url: "/account/saved-locations",
    icon: "cards/favourite-filled",
    countKey: "locations",
  },
];

export const navigationGroups: AccountNavigationGroup[] = [
  {
    title: "Dashboard",
    icon: "account/dash",
    items: navigationHome,
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

export const logout = async () => {
  const { clear } = useUserSession()
  await clear()
  // Notify other open tabs to also log out
  if (import.meta.client) {
    try { new BroadcastChannel('virify:auth').postMessage({ type: 'logout' }) } catch {}
  }
  const route = useRoute()
  if (route.path.startsWith('/account')) {
    navigateTo('/')
  }
};