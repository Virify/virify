/**
 * Base center items for the site navigation (static structure only).
 * Guides children are injected dynamically by the composable.
 */
export const getBaseCenterItems = (): NavigationItem[] => {
  const { isWaitingListMode, config } = useWaitingListMode();

  const items: NavigationItem[] = [
    {
      id: "home",
      label: "Home",
      type: "link",
      href: "/",
    },
    {
      id: "guides",
      label: "Guides",
      href: "/guides",
      type: "dropdown",
      children: [],
    },
  ];

  items.push({
    id: "property-info",
    label: "Property Information",
    type: "dropdown",
    children: [{ id: "price-paid", label: "Price paid data", href: "/price-paid/", icon: "account/billing" }],
  });

  // items.push({
  //   id: "mortgage-calculator",
  //   label: "Mortgage Calculator",
  //   href: "/mortgage-calculator/",
  //   type: "link",
  // })

  // Add Contact link only in waiting list mode
  if (isWaitingListMode.value) {
    items.push({
      id: "contact",
      label: "Contact Us",
      href: "/contact/",
      type: "link",
    });
  }

  return items;
};

/**
 * Factory returning a function that builds action items based on auth state and action callbacks.
 */
export const getActionItemsBuilder = () => {
  return ({ loggedIn, actions }: { loggedIn: boolean; actions: { openLogin: () => void; openSignup: () => void; logout: () => void } }): NavigationItem[] => {
    const { isWaitingListMode, config } = useWaitingListMode();

    const items: NavigationItem[] = [];

    // Only show auth buttons if configured to show (disabled in waiting-list mode by default)
    if (!isWaitingListMode.value || config.navigation.showAuth) {
      if (!loggedIn) {
        items.push({ 
          id: "signup", 
          label: "Signup", 
          type: "button", 
          hideWhenAuth: true, 
          action: actions.openSignup, buttonClass: "button-monochrome"
        });
      } else if (!isWaitingListMode.value || config.navigation.showAccount) {
        items.push({ 
          id: "account", 
          label: "Account", 
          href: "/account", 
          type: "link", 
          requiresAuth: true 
        });
      }
    }

    // Add theme toggle last (always visible)
    if (loggedIn) {
      items.push({ 
        id: "logout", 
        label: "Logout", 
        type: "button", 
        requiresAuth: true, 
        action: actions.logout, 
        buttonClass: "button-monochrome" 
      }, 
      { 
        id: "theme-toggle", 
        label: "Theme", 
        type: "component" 
      });
    } else {
      items.push({ 
        id: "login",
        label: "Login",
        type: "button", 
        hideWhenAuth: true, 
        action: actions.openLogin, 
        buttonClass: "button-monochrome" 
      }, 
      { 
        id: "theme-toggle", 
        label: "Theme", 
        type: "component"
      });
    }

    return items.filter((item) => {
      if (item.requiresAuth && !loggedIn) return false;
      if (item.hideWhenAuth && loggedIn) return false;
      return true;
    });
  };
};
