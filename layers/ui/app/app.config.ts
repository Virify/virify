export default defineAppConfig({
  ui: {
    colors: {
      primary: "brand-purple",
      secondary: "brand-orange",
      tertiary: "tertiary",
      accent: "brand-accent",
      neutral: "monochrome",
      bg: "brand-bg",
    },
    skeleton: {
      base: "skeleton-fluid",
      background: "",
      rounded: "",
    },
    input: {
      compoundVariants: [
        {
          variant: "subtle",
          class: "outline-0!",
        },
      ],
    },
    textarea: {
      compoundVariants: [
        {
          variant: "subtle",
          class: "outline-0!",
        },
      ],
    },
    navigationMenu: {
      compoundVariants: [
        // Active state for sidebar navigation (expanded)
        {
          variant: "pill",
          active: true,
          collapsed: false,
          class: {
            link: "text-secondary before:bg-white/5",
            linkLeadingIcon: "text-secondary",
          },
        },
        // Active state for sidebar navigation (collapsed)
        {
          variant: "pill",
          active: true,
          collapsed: true,
          class: {
            link: "text-white before:bg-white/5",
            linkLeadingIcon: "text-white",
            item: "mb-1",
          },
        },
        // Hover state for sidebar navigation (expanded)
        {
          disabled: false,
          active: false,
          variant: "pill",
          collapsed: false,
          class: {
            link: "hover:text-white hover:before:bg-white/5",
            linkLeadingIcon: "group-hover:text-secondary",
          },
        },
        // Hover state for sidebar navigation (collapsed)
        {
          disabled: false,
          active: false,
          variant: "pill",
          collapsed: true,
          class: {
            link: "hover:text-white hover:before:bg-white/5",
            linkLeadingIcon: "group-hover:text-white",
            item: "mb-2",
          },
        },
        // Popover child links styling
        {
          active: true,
          class: {
            childLink: "before:bg-white/5 text-secondary",
            childLinkIcon: "text-secondary",
          },
        },
        {
          disabled: false,
          active: false,
          class: {
            childLink: "hover:before:bg-white/5 hover:text-white transition-colors before:transition-colors",
            childLinkIcon: "group-hover:text-secondary transition-colors",
          },
        },
      ],
    },
    toast: {
      slots: {
        root: 'bg-(--background-200)'
      },
    },
    formField: {
      slots: {
        label: 'body-sm text-(--foreground-100)',
        description: 'body-xs text-(--foreground-200)/60',
        root: 'flex flex-col gap-1.5',
        error: 'w-full body-xs',
        help: 'body-xs text-(--foreground-200)/60 mt-1',
      }
    },
  },
});
