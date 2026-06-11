import { joinURL, withTrailingSlash } from "ufo";

interface GuideSlug {
  current?: string;
  [key: string]: unknown;
}

interface GuideCategory {
  _id?: string;
  slug?: GuideSlug;
  title?: string;
  description?: string;
  icon?: string;
  guides?: GuideCategory[];
}

interface GeneralPage {
  _id?: string;
  title?: string;
  slug?: GuideSlug;
}

interface PageCategory {
  _id?: string;
  title?: string;
  slug?: GuideSlug;
  pages?: GeneralPage[];
}

interface MenuItem {
  id?: string;
  label?: string;
  href?: string;
  description?: string;
  icon?: string;
  isViewAll?: boolean;
  type: "link" | "dropdown";
  children?: MenuItem[];
}

/**
 *  Extract current slug from category slug object
 */
function getSlugForGuide(slug?: GuideSlug) {
  const { current } = asObject(slug);

  if (typeof current !== "string") return "#";

  return current;
}

/**
 *  Format content page categories
 */
function formatContentCategory(category: PageCategory) {
  const { _id, title, slug, pages } = asObject(category);

  const currentSlug = getSlugForGuide(slug);
  const fullSlug = joinURL("/content/", currentSlug);
  const fullSlugWithSlash = withTrailingSlash(fullSlug, true);

  const formattedCategory: MenuItem = {
    id: _id,
    label: title,
    icon: "article",
    type: "link",
  };

  if (Array.isArray(pages) && pages.length) {
    formattedCategory.type = "dropdown";
    formattedCategory.children = [
      {
        href: fullSlugWithSlash,
        label: `View All`,
        type: "link",
        isViewAll: true,
      },
      ...pages.map((page) => {
        const pageSlug = getSlugForGuide(asObject(page).slug);
        return {
          id: asObject(page)._id,
          label: asObject(page).title,
          href: withTrailingSlash(joinURL(fullSlugWithSlash, pageSlug), true),
          type: "link" as const,
        };
      }),
    ];
  } else {
    formattedCategory.href = fullSlugWithSlash;
  }

  return formattedCategory;
}

/**
 *  Recursively format guide categories
 */
function formatGuides(category: GuideCategory, parentSlug = "/guides/") {
  const { _id, title, description, slug, icon } = asObject(category);

  const currentSlug = getSlugForGuide(slug);
  const fullSlug = joinURL(parentSlug, currentSlug);
  const fullSlugWithSlash = withTrailingSlash(fullSlug, true);

  // Format guides to correct structure
  const formattedCategory: MenuItem = {
    id: _id,
    label: title,
    description: description,
    icon: icon || "article",
    type: "link",
  };

  // If the guides has any children, format and append them as well
  if (Array.isArray(category.guides)) {
    formattedCategory.type = "dropdown";
    formattedCategory.children = [
      {
        href: fullSlugWithSlash,
        label: `View All`,
        type: "link",
        isViewAll: true,
      },
      ...category.guides.map((child) => {
        return formatGuides(child, fullSlugWithSlash);
      }),
    ];
  }
  // Otherwise the category is a link, so include the href
  else {
    formattedCategory.href = fullSlugWithSlash;
  }

  return formattedCategory;
}

export default defineCachedEventHandler(
  async (event) => {
    const baseNavigation: MenuItem[] = [
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
      {
        id: "property-info",
        label: "Tools",
        type: "dropdown",
        children: [
          {
            id: "price-paid",
            label: "Price paid data",
            href: "/price-paid/",
            icon: "account/billing",
            type: "link",
          },
          {
            id: "mortgage-calculator",
            label: "Mortgage Calculator",
            href: "/mortgage-calculator/",
            icon: "account/billing",
            type: "link",
          },
        ],
      },
      {
        id: "content",
        label: "Content",
        href: "/content",
        type: "dropdown",
        children: [],
      },
      {
        id: "support",
        label: "Support",
        href: "/support/",
        type: "link",
      },
      {
        id: "contact",
        label: "Contact",
        href: "/contact/",
        type: "link",
      },
    ];

    // Get active guide pages and content page categories
    const { guides, generalPages } = await useSanity().fetch(navigationQuery);

    const hasGuides = Array.isArray(guides) && guides.length;
    const hasContent = Array.isArray(generalPages) && generalPages.length;

    // Remove nav items with no data
    let filteredNav = baseNavigation;
    if (!hasGuides) filteredNav = filteredNav.filter(({ id }) => id !== "guides");
    if (!hasContent) filteredNav = filteredNav.filter(({ id }) => id !== "content");

    if (hasGuides) {
      const formattedGuides = guides.map((category: GuideCategory) =>
        formatGuides(category),
      );
      for (const dropdown of filteredNav) {
        if (dropdown.id !== "guides") continue;
        dropdown.children?.push(...formattedGuides);
      }
    }

    if (hasContent) {
      const formattedContent = generalPages.map((category: PageCategory) =>
        formatContentCategory(category),
      );
      for (const dropdown of filteredNav) {
        if (dropdown.id !== "content") continue;
        dropdown.children?.push(...formattedContent);
      }
    }

    return filteredNav;
  },
  {
    maxAge: 300, // 5 minutes (60*5)
    getKey: () => "navigation",
  },
);
