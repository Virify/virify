export const basicFeatures: string[] = [
  'Listing creator tools',
  'Up to 8 images',
  'Verified identification and property ownership',
  'Basic analytics'
];

export const professionalFeatures: string[] = [
  'Everything in Standard, plus:',
  'Up to 25 images',
  'Video media uploads',
  'Improved listing card visibility',
  'Advanced analytics',
];

export const premiumFeatures: string[] = [
  'Everything in Premium, plus:',
  'Larger more detailed listing cards',
  'Gallery on search results',
  'Priority placement',
  'Up to 50 images',
  'Priority support',
  'Professional analytics',
];

export const tableTiers = ref<any[]>([
  {
    id: 'basic',
    title: 'Basic',
    description: 'Entry level listing',
    price: 'Free',
    discount: '£10',
    "billing-cycle": 'per month',
    button: {
      label: 'Create Listing',
      color: 'neutral',
      variant: 'subtle',
      size: 'xs',
    }
  },
  {
    id: 'premium',
    title: 'Premium',
    description: 'Enhanced visibility',
    price: 'Free',
    discount: '£150',
    "billing-cycle": 'per month',
    highlight: true,
    variant: 'subtle',
    button: {
      label: 'Create Listing',
      color: 'primary',
      variant: 'solid',
      size: 'xs',
    }
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Professional features',
    discount: '£75',
    price: 'Free',
    "billing-cycle": 'per month',
    button: {
      label: 'Create Listing',
      color: 'secondary',
      variant: 'solid',
      size: 'xs',
    }
  }
])

export const joinTableTiers = ref<any[]>([
  {
    id: 'basic',
    title: 'Basic',
    description: 'Entry level listing',
    price: '£10',
    "billing-cycle": 'per month',
    button: {
      label: 'Coming soon',
      color: 'neutral',
      variant: 'subtle',
      size: 'xs',
    }
  },
  {
    id: 'premium',
    title: 'Premium',
    description: 'Enhanced visibility',
    price: '£150',
    "billing-cycle": 'per month',
    highlight: true,
    variant: 'subtle',
    button: {
      label: 'Coming soon',
      color: 'primary',
      variant: 'solid',
      size: 'xs',
    }
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Professional features',
    discount: '£75',
    price: 'Free',
    "billing-cycle": 'For early access',
    button: {
      label: 'Coming soon',
      color: 'secondary',
      variant: 'solid',
      size: 'xs',
    }
  }
])

export const tableSections = ref([
  {
    title: 'Listing Features',
    features: [
      {
        title: 'Maximum photos',
        tiers: {
          basic: '5',
          premium: '50',
          professional: '20'
        }
      },
      {
        title: 'Video upload',
        tiers: {
          basic: false,
          premium: true,
          professional: true
        }
      },
      {
        title: 'Virtual tour',
        tiers: {
          basic: false,
          premium: true,
          professional: false
        }
      }
    ]
  },
  {
    title: 'Marketing & Visibility',
    features: [
      {
        title: 'Featured listing',
        tiers: {
          basic: false,
          premium: true,
          professional: true
        }
      },
      {
        title: 'Social media sharing',
        tiers: {
          basic: true,
          premium: true,
          professional: true
        }
      },
      {
        title: 'Premium placement',
        tiers: {
          basic: false,
          premium: true,
          professional: false
        }
      }
    ]
  },
  {
    title: 'Analytics & Tools',
    features: [
      {
        title: 'View tracking',
        tiers: {
          basic: true,
          premium: true,
          professional: true
        }
      },
      {
        title: 'Enquiry management',
        tiers: {
          basic: true,
          premium: true,
          professional: true
        }
      },
      {
        title: 'Advanced analytics',
        tiers: {
          basic: false,
          premium: true,
          professional: false
        }
      }
    ]
  }
])