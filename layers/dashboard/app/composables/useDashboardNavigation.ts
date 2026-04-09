import type { NavigationMenuItem } from "@nuxt/ui";
import { createSharedComposable } from "@vueuse/core";

/**
 * Dashboard navigation items for Nuxt UI NavigationMenu component.
 * Returns a computed value that updates when aggregates change
 */
export const useDashboardNavigation = createSharedComposable(() => {
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
    // {
    //   label: "Pricing & Tiers",
    //   icon: "i-lucide-badge-pound-sterling",
    //   tooltip: {
    //     text: "See our pricing and plans",
    //   },
    //   type: "link",
    //   to: "/dashboard/tiers",
    // },
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
          label: "Draft Listings",
          type: "link",
          to: "/dashboard/draft-listings",
          icon: "i-lucide-file-text",
          tooltip: {
            text: "View draft listings",
          },
          badge: aggregates.value.draftListings ? String(aggregates.value.draftListings) : undefined,
        },
        {
          label: "Archived Listings",
          type: "link",
          to: "/dashboard/archived-listings",
          icon: "i-lucide-archive",
          tooltip: {
            text: "View archived listings",
          },
          badge: aggregates.value.archivedListings ? String(aggregates.value.archivedListings) : undefined,
        },
        {
          label: "Create Listing",
          type: "link",
          to: "/dashboard/create-listing",
          icon: "i-lucide-square-plus",
          tooltip: {
            text: "Create a new listing",
          },
        },
        // {
        //   label: "Offers",
        //   type: "link",
        //   to: "#",
        //   icon: "i-lucide-hand-heart",
        //   tooltip: {
        //     text: "Manage offers",
        //   },
        // },
        {
          label: "Viewings",
          type: "link",
          to: "/dashboard/viewings",
          icon: "i-lucide-calendar-check",
          tooltip: {
            text: "Schedule viewings",
          },
          badge: aggregates.value.viewings > 0 ? String(aggregates.value.viewings) : undefined,
        },
        {
          label: "Enquiries",
          type: "link",
          to: "/dashboard/enquiries",
          icon: "i-lucide-message-circle",
          tooltip: {
            text: "View enquiries",
          },
          badge: aggregates.value.unreadConversations ? String(aggregates.value.unreadConversations) : undefined,
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
          label: "Hidden",
          type: "link",
          to: "/dashboard/hidden-listings",
          icon: "i-lucide-eye-off",
          tooltip: {
            text: "Your hidden listings" + (aggregates.value.hiddenListings ? ` (${aggregates.value.hiddenListings})` : ""),
          },
          badge: aggregates.value.hiddenListings ? String(aggregates.value.hiddenListings) : undefined,
        },
        {
          label: "Viewed",
          type: "link",
          to: "/dashboard/viewed",
          icon: "i-lucide-eye",
          tooltip: {
            text: "Recently viewed properties" + (aggregates.value.viewedListings ? ` (${aggregates.value.viewedListings})` : ""),
          },
          badge: aggregates.value.viewedListings ? String(aggregates.value.viewedListings) : undefined,
        },
        {
          label: "Analytics",
          type: "link",
          to: "/dashboard/analytics",
          icon: "i-lucide-bar-chart-3",
          tooltip: {
            text: "View listing performance analytics",
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
      defaultOpen: true,
      children: [
        {
          label: "Saved Locations",
          type: "link",
          to: "/dashboard/saved-locations",
          icon: "i-lucide-map-pin",
          tooltip: {
            text: "Your saved search locations",
          },
          badge: aggregates.value.locations ? String(aggregates.value.locations) : undefined,
        },
        {
          label: "Saved Searches",
          type: "link",
          to: "#",
          icon: "i-lucide-text-search",
          tooltip: {
            text: "Your saved searches",
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
        // {
        //   label: "Settings",
        //   type: "link",
        //   to: "#",
        //   icon: "i-lucide-settings",
        //   tooltip: {
        //     text: "Account settings",
        //   },
        // },
        // {
        //   label: "Billing",
        //   type: "link",
        //   to: "#",
        //   icon: "i-lucide-credit-card",
        //   tooltip: {
        //     text: "Billing & payments",
        //   },
        // },
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
          to: "/dashboard/notifications",
          icon: "i-lucide-bell",
          tooltip: {
            text: "Notification preferences",
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
    // {
    //   label: "Settings",
    //   type: "link",
    //   to: "#",
    //   icon: "i-lucide-settings",
    //   tooltip: {
    //     text: "Account settings",
    //   },
    // },
    // {
    //   label: "Billing",
    //   type: "link",
    //   to: "#",
    //   icon: "i-lucide-credit-card",
    //   tooltip: {
    //     text: "Billing & payments",
    //   },
    // },
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
      to: "/dashboard/notifications",
      icon: "i-lucide-bell",
      tooltip: {
        text: "Notification preferences",
      },
    },
    // {
    //   label: "Analytics",
    //   type: "link",
    //   to: "#",
    //   icon: "i-lucide-chart-bar",
    //   tooltip: {
    //     text: "View analytics",
    //   },
    // },
  ]);

  return {
    dashboardNavigationitems,
    accountNavigationItems,
  };
});
