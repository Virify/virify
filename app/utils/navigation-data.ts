/**
 * Base center items for the site navigation (static structure only).
 * Guides children are injected dynamically by the composable.
 */
export const getBaseCenterItems = (): NavigationItem[] => [
  {
    id: "guides",
    label: "Guides",
    href: "/guides",
    type: "dropdown",
    icon: "chevron-down",
    children: [],
  },
  {
    id: "search",
    label: "Search",
    type: "dropdown",
    icon: "chevron-down",
    children: [
      { id: "ai-search", label: "AI Search", href: "/ai-search/", icon: 'search' },
      { id: "legacy-search", label: "Legacy", href: "/search/legacy/", icon: 'search' },
    ],
  },
  {
    id: "property-info",
    label: "Property Information",
    type: "dropdown",
    icon: "chevron-down",
    children: [{ id: "price-paid", label: "Price paid data", href: "/price-paid/", icon: 'account/billing' }],
  },
];

/**
 * Factory returning a function that builds action items based on auth state and action callbacks.
 */
export const getActionItemsBuilder = () => {
  return ({ loggedIn, actions }: { loggedIn: boolean; actions: { openLogin: () => void; openSignup: () => void; logout: () => void } }): NavigationItem[] => {
    const items: NavigationItem[] = [];

    if (!loggedIn) {
      items.push(
        { id: "login", label: "Login", type: "button", hideWhenAuth: true, action: actions.openLogin, buttonClass: "button-tertiary" },
        { id: "signup", label: "Signup", type: "button", hideWhenAuth: true, action: actions.openSignup, buttonClass: "button-monochrome" }
      );
    } else {
      items.push({ id: "account", label: "Account", href: "/account", type: "link", requiresAuth: true }, { id: "logout", label: "Logout", type: "button", requiresAuth: true, action: actions.logout, buttonClass: "button-monochrome" });
    }

    return items.filter((item) => {
      if (item.requiresAuth && !loggedIn) return false;
      if (item.hideWhenAuth && loggedIn) return false;
      return true;
    });
  };
};
