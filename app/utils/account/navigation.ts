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
  const route = useRoute()
  if (route.path.startsWith('/account')) {
    navigateTo('/')
  }
}

/**
 * Dashboard navigation items for Nuxt UI NavigationMenu component.
 */
export const dashboardNavigationitems = ref<NavigationMenuItem[]>([
  {
    label: 'Dashboard',
    type: 'label',
  },
  {
    label: 'Home',
    icon: 'i-lucide-home',
    type: 'link',
    to: '/dashboard',
    tooltip: {
      text: 'Dashboard Home',
    },
  },
  {
    label: 'Listings',
    icon: 'i-lucide-house-heart',
    type: 'label',
    tooltip: {
      text: 'Manage your property listings',
    },
    defaultOpen: true,
    children: [
      {
        label: 'My Listings',
        type: 'link',
        to: '#',
        icon: 'i-lucide-library',
        tooltip: {
          text: 'View all your listings',
        },
      },
      {
        label: 'Create Listing',
        type: 'link',
        to: '#',
        icon: 'i-lucide-square-plus',
        tooltip: {
          text: 'Create a new listing',
        },
      },
      {
        label: 'Draft Listings',
        type: 'link',
        to: '#',
        icon: 'i-lucide-file-text',
        tooltip: {
          text: 'View draft listings',
        },
      },
      {
        label: 'Offers',
        type: 'link',
        to: '#',
        icon: 'i-lucide-hand-heart',
        tooltip: {
          text: 'Manage offers',
        },
      },
      {
        label: 'Viewings',
        type: 'link',
        to: '#',
        icon: 'i-lucide-calendar-check',
        tooltip: {
          text: 'Schedule viewings',
        },
      },
      {
        label: 'Enquiries',
        type: 'link',
        to: '#',
        icon: 'i-lucide-message-circle',
        tooltip: {
          text: 'View enquiries',
        },
      },
      {
        label: 'Favourites',
        type: 'link',
        to: '#',
        icon: 'i-lucide-heart',
        tooltip: {
          text: 'Your favourite properties',
        },
      },
      {
        label: 'Notes',
        type: 'link',
        to: '#',
        icon: 'i-lucide-sticky-note',
        tooltip: {
          text: 'Your saved notes',
        },
      },
      {
        label: 'Viewed',
        type: 'link',
        to: '#',
        icon: 'i-lucide-eye',
        tooltip: {
          text: 'Recently viewed properties',
        },
      },
    ],
  },
  {
    label: 'Account',
    icon: 'i-lucide-circle-user',
    type: 'label',
    tooltip: {
      text: 'Account settings',
    },
    children: [
      {
        label: 'Profile',
        type: 'link',
        to: '#',
        icon: 'i-lucide-user',
        tooltip: {
          text: 'Your profile',
        },
      },
      {
        label: 'Settings',
        type: 'link',
        to: '#',
        icon: 'i-lucide-settings',
        tooltip: {
          text: 'Account settings',
        },
      },
      {
        label: 'Billing',
        type: 'link',
        to: '#',
        icon: 'i-lucide-credit-card',
        tooltip: {
          text: 'Billing & payments',
        },
      },
      {
        label: 'Security',
        type: 'link',
        to: '#',
        icon: 'i-lucide-shield-check',
        tooltip: {
          text: 'Security settings',
        },
      },
      {
        label: 'Notifications',
        type: 'link',
        to: '#',
        icon: 'i-lucide-bell',
        tooltip: {
          text: 'Notification preferences',
        },
      },
      {
        label: 'Analytics',
        type: 'link',
        to: '#',
        icon: 'i-lucide-chart-bar',
        tooltip: {
          text: 'View analytics',
        },
      }
    ],
  },
  {
    label: 'Search',
    icon: 'i-lucide-search',
    type: 'label',
    tooltip: {
      text: 'Search preferences',
    },
    children: [
      {
        label: 'Saved Searches',
        type: 'link',
        to: '#',
        icon: 'i-lucide-text-search',
        tooltip: {
          text: 'Your saved searches',
        },
      },
      {
        label: 'Saved Locations',
        type: 'link',
        to: '#',
        icon: 'i-lucide-bookmark',
        tooltip: {
          text: 'Your saved locations',
        },
      },
    ],
  },
  {
    label: 'Help & Support',
    icon: 'i-lucide-message-circle-question-mark',
    type: 'label',
    tooltip: {
      text: 'Get help',
    },
    children: [
      {
        label: 'Documentation',
        type: 'link',
        to: '#',
        icon: 'i-lucide-book-open',
        tooltip: {
          text: 'View documentation',
        },
      },
      {
        label: 'Contact Support',
        type: 'link',
        to: '#',
        icon: 'i-lucide-headphones',
        tooltip: {
          text: 'Contact support team',
        },
      },
    ],
  },
]);