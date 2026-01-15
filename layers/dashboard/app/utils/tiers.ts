export const basicFeatures = [
  'Listing creator tools',
  'Up to 8 images',
  'Verified identification and property ownership',
  'Basic analytics'
];

export const professionalFeatures = [
  'Everything in Standard, plus:',
  'Up to 25 images',
  'Video media uploads',
  'Improved listing card visibility',
  'Advanced analytics',
];

export const premiumFeatures = [
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
    price: 'Free',
    variant: 'soft',
    button: {
      label: 'Create Listing',
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
          premium: '20',
          professional: 'Unlimited'
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
          premium: false,
          professional: true
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
          premium: false,
          professional: true
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
          premium: false,
          professional: true
        }
      }
    ]
  }
])