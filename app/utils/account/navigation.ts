export const navigationHome: NavigationItem[] = [
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

export const accountNavigation: NavigationItem[] = [
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
    url: "#",
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

export const listingsNavigation: NavigationItem[] = [
  {
    name: "My Listings",
    url: "#",
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
    url: "#",
    icon: "cards/notes",
    countKey: "notes",
  },
  {
    name: "List New Property",
    url: "#",
    icon: "draw",
  },
];

export const searchNavigation: NavigationItem[] = [
  {
    name: "Saved Searches",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "savedSearches",
  },
  {
    name: "Saved Locations",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "locations",
  },
];

export const navigationGroups: NavigationGroup[] = [
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
  const route = useRoute()
  if (route.path.startsWith('/account')) {
    navigateTo('/')
  }
}
