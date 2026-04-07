import type { NavigationMenuItem } from "@nuxt/ui";

export function useAdminNavigation() {
  const adminNavigationItems = computed<NavigationMenuItem[]>(() => [
    {
      label: "Overview",
      icon: "i-lucide-layout-dashboard",
      type: "link",
      to: "/admin",
      tooltip: { text: "Platform overview" },
    },
    {
      label: "Users",
      icon: "i-lucide-users",
      type: "link",
      to: "/admin/users",
      tooltip: { text: "User intelligence" },
    },
    {
      label: "Listings",
      icon: "i-lucide-home",
      type: "link",
      to: "/admin/listings",
      tooltip: { text: "Listing analytics" },
    },
    {
      label: "Search Intelligence",
      icon: "i-lucide-map-pin",
      type: "link",
      to: "/admin/search",
      tooltip: { text: "Search & demand data" },
    },
    {
      label: "Engagement",
      icon: "i-lucide-activity",
      type: "link",
      to: "/admin/engagement",
      tooltip: { text: "Traffic & engagement" },
    },
    {
      label: "Mortgage",
      icon: "i-lucide-calculator",
      type: "link",
      to: "/admin/mortgage",
      tooltip: { text: "Mortgage & affordability" },
    },
  ]);

  return { adminNavigationItems };
}
