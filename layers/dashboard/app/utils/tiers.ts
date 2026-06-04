export const basicFeatures: string[] = [
  "Listing creator tools",
  "Up to " + getMaxImagesForTier("BASIC") + " images",
  "Analytics",
  "Support for all",
  "Carousel listing cards",
];

export const professionalFeatures: string[] = [
  "Everything in Standard, plus:",
  "Up to " + getMaxImagesForTier("PREMIUM") + " images",
  "Video media uploads",
  "Improved listing card visibility",
  "Advanced analytics",
];

export const premiumFeatures: string[] = [
  "Everything in Premium, plus:",
  "Larger more detailed listing cards",
  "Gallery on search results",
  "Priority placement",
  "Up to " + getMaxImagesForTier("FEATURED") + " images",
  "Priority support",
  "Professional analytics",
];

export const tableTiers = ref<any[]>([
  {
    id: "basic",
    title: "Personal",
    description: "Free to use",
    price: "Free",
    highlight: true,
    button: {
      label: "Create Listing",
      color: "neutral",
      variant: "subtle",
      size: "xs",
    },
  },
  {
    id: "premium",
    title: "Premium",
    description: "Enhanced visibility",
    price: "Coming soon",
    variant: "subtle",
    button: {
      label: "Create Listing",
      color: "primary",
      variant: "solid",
      size: "xs",
    },
  },
  {
    id: "professional",
    title: "Professional",
    description: "Professional features",
    price: "Coming soon",
    variant: "soft",
    button: {
      label: "Create Listing",
      color: "secondary",
      variant: "solid",
      size: "xs",
    },
  },
]);

export const tableSections = ref([
  {
    title: "Listing Features",
    features: [
      {
        title: "Maximum photos",
        tiers: {
          basic: "20",
          premium: "50",
          professional: "30",
        },
      },
      {
        title: "Video upload",
        tiers: {
          basic: false,
          premium: true,
          professional: true,
        },
      },
      {
        title: "Virtual tour",
        tiers: {
          basic: false,
          premium: true,
          professional: false,
        },
      },
    ],
  },
  {
    title: "Marketing & Visibility",
    features: [
      {
        title: "Featured listing",
        tiers: {
          basic: false,
          premium: true,
          professional: true,
        },
      },
      {
        title: "Social media sharing",
        tiers: {
          basic: true,
          premium: true,
          professional: true,
        },
      },
      {
        title: "Premium placement",
        tiers: {
          basic: false,
          premium: true,
          professional: false,
        },
      },
    ],
  },
  {
    title: "Analytics & Tools",
    features: [
      {
        title: "View tracking",
        tiers: {
          basic: true,
          premium: true,
          professional: true,
        },
      },
      {
        title: "Enquiry management",
        tiers: {
          basic: true,
          premium: true,
          professional: true,
        },
      },
      {
        title: "Advanced analytics",
        tiers: {
          basic: false,
          premium: true,
          professional: false,
        },
      },
    ],
  },
]);
