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
    select: {
      slots: {
        base: "bg-(--background-100)! placeholder:text-(--foreground-200)/60! focus:outline-none!",
        group: "bg-(--background-100)!",
        item: 'hover:bg-(--background-300)/50! focus:outline-none! cursor-pointer!',
        placeholder: "text-(--foreground-200)/60!",
      },
    },
    input: {
      slots: {
        base: "bg-(--background-100)! placeholder:text-(--foreground-200)/60! focus:outline-none! ",
        input: "text-(--foreground-100)",
      },
      compoundVariants: [
        {
          variant: "subtle",
          class: "outline-0!",
        },
      ],
    },
    textarea: {
      slots: {
        base: "bg-(--background-100)! placeholder:text-(--foreground-200)/60! focus:outline-none!",
      },
      compoundVariants: [
        {
          variant: "subtle",
          class: "outline-0!",
        },
      ],
    },
    toast: {
      slots: {
        root: "bg-(--background-100)",
      },
    },
    formField: {
      slots: {
        label: "body-sm text-(--foreground-100) font-semibold",
        description: "body-xs text-(--foreground-200)/60",
        root: "flex flex-col gap-1.5",
        error: "w-full body-xs",
        help: "body-xs text-(--foreground-200)/60 mt-1",
        hint: "body-xs text-(--foreground-200)/60",
      },
    },
    navigationMenu: {
      slots: {
        viewport: 'bg-(--background-100)! ring-0! border-0!',
        arrow: 'bg-(--background-100)! border-white/20!',
      },
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
            link: "hover:text-foreground hover:before:bg-white/5",
            linkLeadingIcon: "group-hover:text-foreground",
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
  },
});
