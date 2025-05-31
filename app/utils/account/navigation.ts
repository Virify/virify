import type { NavigationItem } from './types';

export const accountNavigation: NavigationItem[] = [
  {
    name: "Dashboard",
    url: "#",
    icon: "property/house",
  },
  {
    name: "Notifications",
    url: "#",
    icon: "account/notifications",
    countKey: "notifications",
  },
  {
    name: "Profile",
    url: "#",
    icon: "profile",
  },
  {
    name: "Favourites",
    url: "#",
    icon: "cards/favourite-filled",
    countKey: "favourites",
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
    name: "My Listings",
    url: "#",
    icon: "read-more",
    countKey: "listings",
  },
  {
    name: "Notes",
    url: "#",
    icon: "cards/notes",
    countKey: "notes",
  },
  {
    name: "Messages",
    url: "/user/messages",
    icon: "account/chat",
    countKey: "messages",
  },
  {
    name: "Viewings",
    url: "#",
    icon: "account/viewing",
    countKey: "viewings",
  },
  {
    name: "Enquiries",
    url: "/user/messages",
    icon: "account/enquiry",
    countKey: "enquiries",
  },
  {
    name: "Biilling & Plans",
    url: "#",
    icon: "account/billing",
  },
  {
    name: "Preferences",
    url: "#",
    icon: "account/account-preferences",
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
    name: "Settings",
    url: "#",
    icon: "account/settings",
  },
  {
    name: "Logout",
    url: "#",
    icon: "arrow-right",
    action: "logout",  // Add an action identifier
  },
  {
    name: "Delete Account",
    url: "#",
    icon: "cross",
    action: "delete",
  },
];
