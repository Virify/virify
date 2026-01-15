import type { NavigationMenuItem } from "@nuxt/ui";

/**
 * Dashboard navigation items for Nuxt UI NavigationMenu component.
 * Returns a computed value that updates when aggregates change
 */
export function useDashboardNavigation() {
  const { aggregates } = useNotifications();

  const dashboardNavigationitems = computed<NavigationMenuItem[]>(() => [
    {
      label: "Home",
      icon: "i-lucide-home",
      type: "link",
      to: "/dashboard",
      tooltip: {
        text: "Dashboard Home",
      },
    },
    {
      label: "Listings",
      icon: "i-lucide-house-heart",
      tooltip: {
        text: "Manage your property listings",
      },
      defaultOpen: true,
      children: [
        {
          label: "My Listings",
          type: "link",
          to: "/dashboard/my-listings",
          icon: "i-lucide-library",
          tooltip: {
            text: "View all your listings",
          },
          badge: aggregates.value.listings ? String(aggregates.value.listings) : undefined,
        },
        {
          label: "Offers",
          type: "link",
          to: "#",
          icon: "i-lucide-hand-heart",
          tooltip: {
            text: "Manage offers",
          },
        },
        {
          label: "Viewings",
          type: "link",
          to: "#",
          icon: "i-lucide-calendar-check",
          tooltip: {
            text: "Schedule viewings",
          },
        },
        {
          label: "Enquiries",
          type: "link",
          to: "/dashboard/enquiries",
          icon: "i-lucide-message-circle",
          tooltip: {
            text: "View enquiries",
          },
          badge: aggregates.value.unreadConversations ? String(aggregates.value.unreadConversations) : aggregates.value.enquiries ? String(aggregates.value.enquiries) : undefined,
        },
        {
          label: "Favourites",
          type: "link",
          to: "/dashboard/favourites",
          icon: "i-lucide-heart",
          tooltip: {
            text: "Your favourite properties",
          },
          badge: aggregates.value.favourites ? String(aggregates.value.favourites) : undefined,
        },
        {
          label: "Notes",
          type: "link",
          to: "/dashboard/notes",
          icon: "i-lucide-sticky-note",
          tooltip: {
            text: "Your saved notes" + (aggregates.value.notes ? ` (${aggregates.value.notes})` : ""),
          },
          badge: aggregates.value.notes ? String(aggregates.value.notes) : undefined,
        },
        {
          label: "Create Listing",
          type: "link",
          to: "#",
          icon: "i-lucide-square-plus",
          tooltip: {
            text: "Create a new listing",
          },
        },
        {
          label: "Draft Listings",
          type: "link",
          to: "#",
          icon: "i-lucide-file-text",
          tooltip: {
            text: "View draft listings",
          },
        },
        {
          label: "Viewed",
          type: "link",
          to: "#",
          icon: "i-lucide-eye",
          tooltip: {
            text: "Recently viewed properties",
          },
        },
      ],
    },
    {
      label: "Account",
      icon: "i-lucide-circle-user",
      tooltip: {
        text: "Account settings",
      },
      children: [
        // pushing this causes critical errors need to hard code
        {
          label: "Profile",
          type: "link",
          to: "/dashboard/profile",
          icon: "i-lucide-user",
          tooltip: {
            text: "Your profile",
          },
        },
        {
          label: "Settings",
          type: "link",
          to: "#",
          icon: "i-lucide-settings",
          tooltip: {
            text: "Account settings",
          },
        },
        {
          label: "Billing",
          type: "link",
          to: "#",
          icon: "i-lucide-credit-card",
          tooltip: {
            text: "Billing & payments",
          },
        },
        {
          label: "Security",
          type: "link",
          to: "/dashboard/security",
          icon: "i-lucide-shield-check",
          tooltip: {
            text: "Security settings",
          },
        },
        {
          label: "Notifications",
          type: "link",
          to: "#",
          icon: "i-lucide-bell",
          tooltip: {
            text: "Notification preferences",
          },
        },
        {
          label: "Analytics",
          type: "link",
          to: "#",
          icon: "i-lucide-chart-bar",
          tooltip: {
            text: "View analytics",
          },
        },
      ],
    },
    {
      label: "Search",
      icon: "i-lucide-search",
      tooltip: {
        text: "Search preferences",
      },
      children: [
        {
          label: "Saved Searches",
          type: "link",
          to: "#",
          icon: "i-lucide-text-search",
          tooltip: {
            text: "Your saved searches",
          },
        },
        {
          label: "Saved Locations",
          type: "link",
          to: "#",
          icon: "i-lucide-bookmark",
          tooltip: {
            text: "Your saved locations",
          },
        },
      ],
    },
    {
      label: "Help & Support",
      icon: "i-lucide-message-circle-question-mark",
      tooltip: {
        text: "Get help",
      },
      children: [
        {
          label: "Documentation",
          type: "link",
          to: "#",
          icon: "i-lucide-book-open",
          tooltip: {
            text: "View documentation",
          },
        },
        {
          label: "Contact Support",
          type: "link",
          to: "#",
          icon: "i-lucide-headphones",
          tooltip: {
            text: "Contact support team",
          },
        },
      ],
    },
  ]);

  /**
   * Account navigation items for Nuxt UI NavigationMenu component.
   */
  const accountNavigationItems = computed<NavigationMenuItem[]>(() => [
    {
      label: "Profile",
      type: "link",
      to: "/dashboard/profile",
      icon: "i-lucide-user",
      tooltip: {
        text: "Your profile",
      },
    },
    {
      label: "Settings",
      type: "link",
      to: "#",
      icon: "i-lucide-settings",
      tooltip: {
        text: "Account settings",
      },
    },
    {
      label: "Billing",
      type: "link",
      to: "#",
      icon: "i-lucide-credit-card",
      tooltip: {
        text: "Billing & payments",
      },
    },
    {
      label: "Security",
      type: "link",
      to: "/dashboard/security",
      icon: "i-lucide-shield-check",
      tooltip: {
        text: "Security settings",
      },
    },
    {
      label: "Notifications",
      type: "link",
      to: "#",
      icon: "i-lucide-bell",
      tooltip: {
        text: "Notification preferences",
      },
    },
    {
      label: "Analytics",
      type: "link",
      to: "#",
      icon: "i-lucide-chart-bar",
      tooltip: {
        text: "View analytics",
      },
    },
  ]);

  const listingsAccountNavigation = computed<NavigationMenuItem[]>(() => [
   
        {
          label: "My Listings",
          type: "link",
          to: "/dashboard/my-listings",
          icon: "i-lucide-library",
          tooltip: {
            text: "View all your listings",
          },
          badge: aggregates.value.listings ? String(aggregates.value.listings) : undefined,
        },
        {
          label: "Offers",
          type: "link",
          to: "#",
          icon: "i-lucide-hand-heart",
          tooltip: {
            text: "Manage offers",
          },
        },
        {
          label: "Viewings",
          type: "link",
          to: "#",
          icon: "i-lucide-calendar-check",
          tooltip: {
            text: "Schedule viewings",
          },
        },
        {
          label: "Enquiries",
          type: "link",
          to: "/dashboard/enquiries",
          icon: "i-lucide-message-circle",
          tooltip: {
            text: "View enquiries",
          },
          badge: aggregates.value.unreadConversations ? String(aggregates.value.unreadConversations) : aggregates.value.enquiries ? String(aggregates.value.enquiries) : undefined,
        },
        {
          label: "Favourites",
          type: "link",
          to: "/dashboard/favourites",
          icon: "i-lucide-heart",
          tooltip: {
            text: "Your favourite properties",
          },
          badge: aggregates.value.favourites ? String(aggregates.value.favourites) : undefined,
        },
        {
          label: "Notes",
          type: "link",
          to: "/dashboard/notes",
          icon: "i-lucide-sticky-note",
          tooltip: {
            text: "Your saved notes" + (aggregates.value.notes ? ` (${aggregates.value.notes})` : ""),
          },
          badge: aggregates.value.notes ? String(aggregates.value.notes) : undefined,
        },
        {
          label: "Create Listing",
          type: "link",
          to: "#",
          icon: "i-lucide-square-plus",
          tooltip: {
            text: "Create a new listing",
          },
        },
        {
          label: "Draft Listings",
          type: "link",
          to: "#",
          icon: "i-lucide-file-text",
          tooltip: {
            text: "View draft listings",
          },
        },
        {
          label: "Viewed",
          type: "link",
          to: "#",
          icon: "i-lucide-eye",
          tooltip: {
            text: "Recently viewed properties",
          },
        },
      ]);

  return {
    dashboardNavigationitems,
    accountNavigationItems,
    listingsAccountNavigation,
  };
}
