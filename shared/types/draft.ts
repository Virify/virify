import { Prisma, type Accessibility, type AdditionalFeatures, type Bathroom, type Bedroom, type EnergyAndUtilities, type Garden, type Kitchen, type Land, type OtherRoom, type OutdoorSpace, type Parking, type Reception, type RunningCosts, type Security, type Storage, type Utility, type Yard } from "~~/layers/database/server/database/prisma/generated/client"
import type { ConstructionType, RentalPriceType, SalePriceType } from "~~/layers/database/server/database/prisma/generated/enums";
import type { RentalListingCreateWithoutListingInput, SaleListingCreateWithoutListingInput } from "~~/layers/database/server/database/prisma/generated/models";

export type StepOne = {
  rentalListing?: RentalListingCreateWithoutListingInput
  saleListing?: SaleListingCreateWithoutListingInput
}

export type StepTwo = {
  property: {
    type: number | null
    classification: number | null
    constructionType: ConstructionType | null
    yearBuilt: string | null
    size: number | null
    description: string | null
    totalFloors: number | null
  }
}

export type StepThree = {
  price: number | null
  rentalListing?: {
    deposit: number | null
    holdingDeposit: number | null
    rentFrequency: RentalPriceType | null
    rentalLength: number | null
  },
  saleListing?: {
    priceType: SalePriceType | null
  }
}

export type StepFour = {
  property: {
    address: {
      number: string | null
      street: string | null
      flat: string | null
      name: string | null
      city: string | null
      county: string | null
      locality: string | null
      district: string | null
      country: string | null
      postcode: string | null
      fullAddress: string | null
      lat: number | null
      lon: number | null
    } | null
  }
}

export type StepFive = {
  property: {
    totalFloors: number
    bedroomFeatures: Omit<Bedroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[]
    numberBedrooms: number | null
    bathroomFeatures: Omit<Bathroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[]
    numberBathrooms: number | null
  }
}

export type StepSix = {
  property: {
    totalFloors: number
    kitchenFeatures: Omit<Kitchen, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[]
    numberKitchens: number | null
    reception: Omit<Reception, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[]
    numberReceptions: number | null
    otherRoom: Omit<OtherRoom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt' | 'media'>[]
    numberOtherRooms: number | null
  }
}

export type StepSeven = {
  property: {
    outdoorSpace: {
      totalArea: number | null
      garden: Omit<Garden, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[]
      yard: Omit<Yard, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[]
      land: Omit<Land, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[]
      description: string | null
    }
  }
}

export type StepEight = {
  property: {
    additionalFeatures?: Omit<AdditionalFeatures | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    accessibilityFeatures?: Omit<Accessibility | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    parking?: Omit<Parking | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    securityFeatures?: Omit<Security | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    storageFeatures?: Omit<Storage | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    utility?: Omit<Utility | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
  }
}

export type StepNine = {
  property: {
    // ignore broadband type, full fibre and maxdownloadspeed as they are being deprecated for API
    energyAndUtilities?: Omit<EnergyAndUtilities | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
    runningCosts?: Omit<RunningCosts | null, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'> | null
  }
}

export type StepTen = {
  property: {
    bedroomFeatures: Omit<Bedroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>[]
    bathroomFeatures: Omit<Bathroom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>[]
    kitchenFeatures: Omit<Kitchen, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>[]
    reception: Omit<Reception, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>[]
    otherRoom: Omit<OtherRoom, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>[]
    outdoorSpace: {
      garden: Omit<Garden, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt'>[]
      yard: Omit<Yard, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt'>[]
      land: Omit<Land, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt'>[]
    }
    media: {
      url: string
      type: 'image' | 'video'
      description: string | null
      isCover: boolean
    }[]
  }
}

export type DraftListingWithFullPayload = Prisma.DraftListingGetPayload<{
  include: {
    rentalListing: true,
    saleListing: true,
    property: {
      include: {
        address: true,
        media: true,
        type: true,
        classification: true,
        bedroomFeatures: {
          include: {
            media: true,
          },
        },
        bathroomFeatures: {
          include: {
            media: true,
          },
        },
        otherRoom: {
          include: {
            media: true,
          },
        },
        parking: true,
        amenities: true,
        additionalFeatures: true,
        accessibilityFeatures: true,
        kitchenFeatures: {
          include: {
            media: true,
          },
        },
        reception: {
          include: {
            media: true,
          },
        },
        utility: true,
        outdoorSpace: {
          include: {
            garden: {
              include: {
                media: true,
              },
            },
            yard: {
              include: {
                media: true,
              },
            },
            land: {
              include: {
                media: true,
              },
            },
            media: true,
          },
        },
        energyAndUtilities: true,
        securityFeatures: true,
        storageFeatures: true,
        runningCosts: true,
      },
    },
    user: {
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    },
  },
}>;