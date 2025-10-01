import { Prisma, type Bathroom, type Bedroom, type Garden, type Kitchen, type Land, type OtherRoom, type OutdoorSpace, type Reception } from "~~/layers/database/server/database/prisma/generated/client"
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
      totalGardenSize: number | null
      garden: Omit<Garden, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[]
      totalLandSize: number | null
      land: Omit<Land, 'id' | 'outdoorSpaceId' | 'createdAt' | 'updatedAt' | 'media'>[]
      description: string | null
    }
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